import { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Post from "../components/Post";
import { Link } from "react-router-dom";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("api/posts/feed");
        const data = await res.json();

        if (data.error) {
          alert(data.error);
          return;
        }

        setPosts(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    getFeedPosts();
  }, []);

  return (
    <>
      {loading && <LinearProgress color="inherit" />}
      {!loading && posts.length === 0 && (
        <div>
          <h1 className="text-3xl">Follow Some Users To Get Feed...</h1>
          <h3 className="text-lg mt-2">
            Refer Our Suggested Users :{" "}
            <Link to="/getsuggetion">
              <u>get users</u>
            </Link>
          </h3>
        </div>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
}

export default HomePage;
