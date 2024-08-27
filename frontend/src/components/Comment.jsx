import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineModeComment } from "react-icons/md";
import { RiShareForwardLine } from "react-icons/ri";

function Comment({ reply }) {
  const [liked, setLiked] = useState(false);
  let randomLike = Math.floor(Math.random() * 10);
  let randomReply = Math.floor(Math.random() * 5);
  let randomDay = Math.floor(Math.random() * 6) + 1;

  return (
    <>
      <div className="ml-80 mt-3">
        <div className="flex justify-start w-full">
          <div className="flex w-7/12">
            <div>
              <Avatar
                className="mt-3"
                src={reply?.userProfilePic}
                alt="Elon Musk"
              />
            </div>
            <div className="ml-3 pt-2">
              <p className="text-lg font-semibold">@{reply?.username}</p>
              <p className="text-lg mt-2">{reply?.text}</p>
            </div>
          </div>
          <div className="float-right">{randomDay} days ago</div>
        </div>

        <div className="px-4 flex gap-x-5 mx-7 pt-3 w-5/12 cursor-pointer">
          <div className="flex gap-x-1">
            {liked === false ? (
              <FaRegHeart
                className="h-6 w-5"
                onClick={() => setLiked(!liked)}
              />
            ) : (
              <FaHeart className="h-6 w-5" onClick={() => setLiked(!liked)} />
            )}
            <p className="font-sm">{randomLike + (liked ? 1 : 0)}</p>
          </div>

          <div className="flex gap-x-1">
            <MdOutlineModeComment className="h-6 w-5" />
            <p className="font-sm">{randomReply}</p>
          </div>

          <div className="flex gap-x-1">
            <RiShareForwardLine className="h-6 w-7" />
          </div>
        </div>
      </div>
      <br />
      <hr className="w-6/12 ml-80" />
    </>
  );
}

export default Comment;
