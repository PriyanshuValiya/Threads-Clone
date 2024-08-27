import "bootstrap/dist/css/bootstrap.min.css";
import { FaChevronDown } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import DummyLoader from "../components/DummyLoader";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import { useSocket } from "../context/SocketContext";

function ChatPage() {
  const [loadConvos, setLoadConvos] = useState(true);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [searchText, setSearchText] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if(conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
  }, [socket, setConversations]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();

        if (data.error) {
          alert(data.error);
          return;
        }

        setConversations(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadConvos(false);
      }
    };

    getConversation();
  }, [setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);

    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();

      if (searchedUser.error) {
        alert(searchedUser.error);
        return;
      }

      // Check if the conversation already exists with the searched user
      const conversationAlreadyExists = conversations.find((conversation) =>
        conversation.participants.some(
          (participant) => participant._id === searchedUser._id
        )
      );

      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        return;
      }

      // If no existing conversation, create a mock conversation
      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };

      setSearchingUser(false);

      setConversations((prevConvs) => [...prevConvs, mockConversation]);
      setSelectedConversation({
        _id: mockConversation._id,
        userId: searchedUser._id,
        username: searchedUser.username,
        userProfilePic: searchedUser.profilePic,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row mx-4 sm:mx-8 h-full sm:h-[600px]">
        <div className="w-full mr-2 sm:w-3/12 h-5/12 sm:h-7/12">
          <div className="flex mb-3 items-center">
            <div className="text-xl sm:text-2xl font-semibold pl-5 pt-2">
              Messages
            </div>
            <FaChevronDown className="h-4 w-4 sm:h-5 sm:w-5 mt-3 ml-3" />
          </div>

          <div className="flex mt-2 pl-2 h-9">
            <input
              className="flex-1 sm:w-56 px-2 outline-none border border-black rounded-lg"
              type="search"
              placeholder="Search Users..."
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              type="button"
              className="w-2/12 pl-1 py-2 border-2 border-gray-500 text-gray-800 hover:bg-gray-800 hover:text-white rounded-md ml-2"
              onClick={(e) => handleConversationSearch(e)}
            >
              {searchingUser ? <Loader /> : <FaMagnifyingGlass className="w-9"/>}
            </button>
          </div>

          <div className="mt-4">
            {loadConvos ? (
              <div>
                <DummyLoader />
                <DummyLoader />
                <DummyLoader />
                <DummyLoader />
              </div>
            ) : (
              <div>
                {conversations.map((conversation) => (
                  <Conversation
                    key={conversation._id}
                    conversation={conversation}
                    isOnline={onlineUsers.includes(
                    conversation.participants[0]._id
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full sm:w-9/12 h-7/12 mt-6 sm:mt-0">
          {!selectedConversation._id ? (
            <div className="flex flex-col items-center justify-center h-full">
              <img
                src="https://logos-world.net/wp-content/uploads/2023/07/Threads-Logo.png"
                alt="Thread_Logo"
                className="h-60 w-96"
              />
              <div className="w-96 text-lg sm:text-3xl font-semibold text-center pt-3">
                Click Or Search Any Chat To Start Conversation...
              </div>
            </div>
          ) : (
            <div className="border-l-2 border-black pl-5">
              <MessageContainer />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ChatPage;
