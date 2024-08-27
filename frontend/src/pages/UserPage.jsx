import { useRecoilState } from "recoil";
import postsAtom from "../atoms/userAtom.js";
import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import LinearProgress from "@mui/material/LinearProgress";
import Post from "../components/Post.jsx";
import { useEffect, useState } from "react";

function UserPage() {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();

        if (data.error) {
          alert(data.error);
          return;
        }

        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    const getPosts = async () => {
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }

        setPosts(data);
      } catch (error) {
        console.error(error);
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getUser();
    getPosts();
  }, [username, setPosts]);

  return (
    <>
      {user && <UserHeader user={user} />}

      {fetchingPosts && (
        <LinearProgress color="inherit" className="w-10/12 mx-auto" />
      )}
      {!fetchingPosts && posts.length === 0 && (
        <h1 className="mt-5 text-center text-3xl font-semibold">
          {user?.name} has not made any posts!
        </h1>
      )}

      {!fetchingPosts && posts.length > 0 && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
        </div>
      )}
    </>
  );
}

export default UserPage;
