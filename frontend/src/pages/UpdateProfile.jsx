import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import LinearProgress from "@mui/material/LinearProgress";

function UpdateProfile() {
  const [user, setUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    name: user?.name,
    username: user?.username,
    email: user?.email,
    password: "",
    bio: user?.bio,
  });

  const { handleImageChange, imgUrl } = usePreviewImg();
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(!loading);

    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
      });

      const data = await res.json();

      if (data.error) {
        console.log(data.error);
        setLoading(false);
        return;
      }

      setUser(data);
      localStorage.setItem("user-threads", JSON.stringify(data));
      setLoading(false);
      navigator(`/${user.username}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="row mt-3">
        <h1 className="col-12 col-md-8 offset-md-2 text-3xl font-semibold text-center text-md-left">
          Update Profile On Threads
        </h1>
        <div className="col-12 col-md-8 offset-md-2 mt-5">
          <form
            className="needs-validation"
            onSubmit={() => handleSubmit(event)}
          >
            <div className="row pb-1">
              <div className="col-12 col-md-4 text-center text-md-left pt-3">
                <img
                  className="w-64 h-64 rounded-full border-2 border-black mx-auto mx-md-0"
                  src={user.profilePic || imgUrl}
                  alt="profile"
                />
              </div>
              <div className="col-12 col-md-8 mt-4 mt-md-0">
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Full Name
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    value={inputs.name}
                    required
                    onChange={(e) =>
                      setInputs({ ...inputs, name: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    User Name
                  </label>

                  <div className="input-group has-validation">
                    <span className="input-group-text" id="inputGroupPrepend">
                      @
                    </span>
                    <input
                      className="form-control"
                      type="text"
                      value={inputs.username}
                      required
                      onChange={(e) =>
                        setInputs({ ...inputs, username: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="formFile" className="form-label">
                    Update Profile Picture
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="formFile"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label"
              >
                Bio
              </label>
              <textarea
                className="form-control"
                id="exampleFormControlTextarea1"
                rows="1"
                placeholder="Enter Your Biography Here..."
                value={inputs.bio}
                onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                E-Mail
              </label>
              <input
                className="form-control"
                type="text"
                placeholder="valiyapriyanshu@gmail.com"
                value={inputs.email}
                required
                onChange={(e) =>
                  setInputs({ ...inputs, email: e.target.value })
                }
              />
            </div>

            {loading && <LinearProgress color="inherit" />}

            <button className="btn btn-dark w-100">
              {loading ? "Updating" : "Update"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdateProfile;
