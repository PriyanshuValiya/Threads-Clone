import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom.js";
import Loader from "./Loader.jsx";

function SigninForm() {
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [load, setLoad] = useState(false);

  const setUser = useSetRecoilState(userAtom);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      const data = await res.json();
      console.log(data);

      if (data.error) {
        setLoad(false);
        alert(data.error);
        return;
      }

      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(data);
      setLoad(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="row mt-3">
        <h1 className="col-6 offset-2 text-3xl font-semibold">
          SignUp On Threads
        </h1>
        <br />
        <br />
        <br />
        <br />
        <div className="col-8 offset-2">
          <form className="needs-validation">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Full Name
              </label>
              <input
                className="form-control"
                type="text"
                placeholder="Priyanshu Valiya"
                required
                onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                value={inputs.name}
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
                  placeholder="priyanshuvaliya"
                  required
                  onChange={(e) =>
                    setInputs({ ...inputs, username: e.target.value })
                  }
                  value={inputs.username}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                E-Mail
              </label>
              <input
                className="form-control"
                type="text"
                placeholder="valiyapriyanshu@gmail.com"
                required
                onChange={(e) =>
                  setInputs({ ...inputs, email: e.target.value })
                }
                value={inputs.email}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                className="form-control"
                type="password"
                placeholder="Priyanshu18"
                required
                onChange={(e) =>
                  setInputs({ ...inputs, password: e.target.value })
                }
                value={inputs.password}
              />
            </div>
            <br />

            <button
              className="btn btn-dark"
              onClick={() => handleSignup(event)}
            >
              {load ? <Loader /> : "Sign-in"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SigninForm;
