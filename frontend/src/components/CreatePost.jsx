import { useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg.js";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const [loading, setLoading] = useState(false);
  const [postText, setPostText] = useState("");
  const user = JSON.parse(localStorage.getItem("user-threads"));
  const nevigate = useNavigate();

  const removeImg = () => {
    setImgUrl("");
  };

  const handleTextChange = (e) => {
    e.preventDefault();
    setPostText(e.target.value);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(!loading);

    const res = await fetch("api/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    setPostText("");
    nevigate(`/${user?.username}`);
  };

  return (
    <>
      <div className="flex">
        <h1 className="max-w-screen-lg mx-auto text-3xl font-semibold">
          Create New Post At Threads...
        </h1>
        <button
          className="btn btn-dark float-right mt-3"
          onClick={() => handleCreatePost(event)}
        >
          {loading ? "Posting" : "Post"}
        </button>
      </div>

      <div className="max-w-screen-lg mx-auto mt-5 text-xl">
        {imgUrl && (
          <div>
            <IoMdClose
              className="font-semibold float-right cursor-pointer"
              onClick={removeImg}
            />
            <img
              className="h-80 border-2 rounded-lg border-black mx-auto"
              src={imgUrl}
              alt="postImg"
            />
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="exampleFormControlTextarea1" className="form-label">
            Content :
          </label>
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            placeholder="Write a caption..."
            required
            onChange={() => handleTextChange(event)}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="formFile" className="form-label">
            Add a Picture :
          </label>
          <input
            className="form-control"
            type="file"
            id="formFile"
            onChange={handleImageChange}
          />
        </div>
      </div>
    </>
  );
}

export default CreatePost;
