import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import DummyLoader from "../components/DummyLoader";
import { Link } from "react-router-dom";

function Suggetion() {
  const [loading, setLoading] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [user, setUser] = useState(null);
  const updating = true;
  const currUser = JSON.parse(localStorage.getItem("user-threads"));

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch(`/api/users/profile/${currUser.username}`);
      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setUser(data);
    };

    getUser();
  }, [currUser]);

  const [following, setFollowing] = useState(
    user?.followers.includes(currUser._id)
  );

  const handleFollowUnfollow = async (userId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/follow/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        setLoading(false);
        return;
      }

      setFollowing(!following);
      setLoading(false);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getSuggestedUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();

        if (data.error) {
          alert(data.error);
          return;
        }

        setSuggestedUsers(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getSuggestedUsers();
  }, []);

  return (
    <>
      <div className="ml-4 sm:ml-8 lg:ml-10">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4">
          Suggested Users On Threads...
        </h1>

        <div className="w-full sm:w-8/12 lg:w-5/12">
          {loading ? (
            <div>
              <DummyLoader />
              <DummyLoader />
              <DummyLoader />
              <DummyLoader />
              <DummyLoader />
            </div>
          ) : (
            <div>
              {suggestedUsers.map((user) => (
                <div
                  className="flex flex-col sm:flex-row items-center justify-between mt-2 ml-1 sm:ml-3 pl-2 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  key={user.username}
                >
                  <Link
                    to={`/${user.username}`}
                    className="flex items-center w-full sm:w-auto"
                  >
                    <div className="relative">
                      <img
                        src={user?.profilePic}
                        alt="Profile"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                      />
                    </div>
                    <div className="ml-3 sm:ml-5">
                      <div className="text-lg sm:text-2xl font-semibold text-gray-900">
                        {user?.name}
                      </div>
                      <div className="flex gap-x-1 sm:gap-x-2 text-sm sm:text-lg text-gray-500 truncate max-w-xs">
                        @{user?.username}
                      </div>
                    </div>
                  </Link>
                  <div className="mt-2 sm:mt-0">
                    <button
                      type="button"
                      className="btn btn-outline-dark sm:me-2"
                      onClick={() => handleFollowUnfollow(user._id)}
                    >
                      {loading && <Loader />}
                      {following ? "Unfollow" : "Follow"}
                    </button>
                  </div>
                </div>
              ))}

              {suggestedUsers.length === 0 && (
                <h2 className="text-xl">
                  Click On Threads Logo To Navigate Home...
                </h2>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Suggetion;
