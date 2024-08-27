import React from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom.js";
import { selectedConversationAtom } from "../atoms/messagesAtom.js";
import { LiaCheckDoubleSolid } from "react-icons/lia";

function Conversation({ conversation, isOnline }) {
  const user = conversation.participants[0];
  const lastMessage = conversation.lastMessage;
  const currentUser = useRecoilValue(userAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );

  return (
    <>
      <div
        className={`flex items-center mt-2 pl-2 py-2 ${
          selectedConversation?._id === conversation._id
            ? "bg-gray-200"
            : "bg-white"
        } rounded-xl cursor-pointer border-b border-gray-200`}
        onClick={() =>
          setSelectedConversation({
            _id: conversation?._id,
            userId: user?._id,
            userProfilePic: user?.profilePic,
            username: user?.username,
            mock: conversation?.mock,
          })
        }
      >
        <div className="relative">
          <img
            src={user?.profilePic}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <span
            className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${
              isOnline ? "bg-green-600" : "bg-gray-300"
            }`}
          />
        </div>
        <div className="ml-3">
          <div className="text-lg font-semibold text-gray-900">
            {user?.username}
          </div>
          <div className="flex gap-x-2 text-sm text-gray-500 truncate max-w-xs">
            {currentUser._id === lastMessage.sender ? (
              <LiaCheckDoubleSolid
                className={`mt-1 h-4 w-4 ${
                  lastMessage.seen && "text-blue-500"
                }`}
              />
            ) : (
              ""
            )}
            {lastMessage?.text || "Photo"}
          </div>
        </div>
      </div>
    </>
  );
}

export default Conversation;
