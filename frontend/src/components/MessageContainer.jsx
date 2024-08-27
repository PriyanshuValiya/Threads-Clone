import React, { useState, useRef, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import LinearProgress from "@mui/material/LinearProgress";
import { AiOutlinePaperClip } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useSocket } from "../context/SocketContext";
import { LiaCheckDoubleSolid } from "react-icons/lia";
import usePreviewImg from "../hooks/usePreviewImg";
import Loader from "./Loader";
import notification from "../assets/sounds/message.mp3";

function ChatBox() {
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const setConversations = useSetRecoilState(conversationsAtom);
  const currUser = JSON.parse(localStorage.getItem("user-threads"));
  const { socket } = useSocket();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);
  const imageRef = useRef(null);

  const removeImg = () => {
    setImgUrl("");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
          img: imgUrl,
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      }

      setMessages((messages) => [...messages, data]);

      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
      setMessageText("");
      setImgUrl("");
    } catch (err) {
      console.log(err);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length && messages[messages.length - 1].sender !== currUser._id;
    if (lastMessageIsFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }

    socket.on("messagesSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prev) => {
          const updatedMessages = prev.map((message) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
  }, [socket, currUser._id, messages, selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectedConversation._id === message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }

      if (!document.hasFocus()) {
        const sound = new Audio(notification);
        sound.play();
      }

      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });

    return () => socket.off("newMessage");
  }, [socket, selectedConversation, setConversations]);

  useEffect(() => {
    const getMessages = async () => {
      if (selectedConversation.mock) {
        return;
      }
      const res = await fetch(`/api/messages/${selectedConversation.userId}`);
      const data = await res.json();

      if (data.error) {
        setLoading(false);
        return;
      }

      setMessages(data);
      setLoading(false);
    };

    getMessages();
  }, [selectedConversation.userId, selectedConversation.mock]);

  return (
    <div
      className="flex flex-col mx-auto border border-gray-300 rounded-l max-w-full"
      style={{ height: "600px" }}
    >
      {/* Header */}
      <div
        className="flex items-center p-4 bg-gray-200 border-b border-gray-200"
        style={{ height: "60px" }}
      >
        <img
          src={selectedConversation.userProfilePic}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-4">
          <div className="text-lg font-semibold text-gray-900">
            {selectedConversation?.username}
          </div>
        </div>
      </div>

      {/* Message Area */}
      {loading && <LinearProgress color="inherit" />}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message?._id}
            className={`flex ${
              message.sender !== currUser?._id ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`px-2 gap-x-3 py-2 rounded-lg max-w-xs text-white ${
                message.sender !== currUser?._id ? "bg-gray-800" : "bg-blue-500"
              }`}
            >
              {message.img && (
                <div>
                  <img
                    className="rounded-lg"
                    src={message.img}
                    alt="Message_Img"
                  />
                </div>
              )}
              <div className="flex gap-x-2 justify-between">
                {message?.text}
                {message.sender !== currUser?._id ? (
                  ""
                ) : (
                  <LiaCheckDoubleSolid
                    className={`mt-2 h-4 w-4 ${
                      message.seen ? "text-green-900" : "text-white"
                    }`}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {imgUrl && (
        <div>
          <IoMdClose
            className="font-semibold float-right cursor-pointer"
            onClick={removeImg}
          />
          <img
            className="h-52 float-right border-2 rounded-lg border-black mx-auto"
            src={imgUrl}
            alt="postImg"
          />
        </div>
      )}

      {/* Send Box */}
      <div
        className="flex items-center p-4 border-t border-gray-200 bg-white"
        style={{ height: "60px" }}
      >
        <div>
          <AiOutlinePaperClip
            className="h-6 w-6 cursor-pointer"
            onClick={() => imageRef.current.click()}
          />
          <input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={handleImageChange}
          />
        </div>
        <input
          type="text"
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
          className="flex-1 ml-2 border border-gray-300 p-2 rounded-lg focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={() => handleSend(event)}
          className="h-10 w-10 ml-2 bg-blue-500 text-white p-2 rounded-lg"
        >
          {sending ? <Loader /> : <IoSend className="ml-1" />}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
