import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom.js";

function LoginForm() {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const setUser = useSetRecoilState(userAtom);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="row mt-3">
        <h1 className="col-6 offset-2 text-3xl font-semibold">
          LogIn At Threads
        </h1>
        <br />
        <br />
        <br />
        <br />
        <div className="col-8 offset-2">
          <form className="needs-validation">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                User Name
              </label>
              <div className="input-group has-validation">
                <span className="input-group-text" id="inputGroupPrepend">
                  @
                </span>
                <input
                  name="username"
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
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                name="password"
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

            <button className="btn btn-dark" onClick={() => handleLogin(event)}>
              Log-In
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
