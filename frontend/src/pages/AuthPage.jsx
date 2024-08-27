import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SigninForm from "../components/SigninForm";

function AuthPage() {
  const [haveAcc, setHaveAcc] = useState(true);

  const toggle = () => {
    setHaveAcc(!haveAcc);
  };

  return (
    <>
      {haveAcc ? (
        <div>
          <SigninForm />
          <p className="ml-52 mt-5">
            Already Have an account ?{" "}
            <u className="cursor-pointer" onClick={toggle}>
              Login
            </u>
          </p>
        </div>
      ) : (
        <div>
          <LoginForm />
          <p className="ml-52 mt-5">
            Go Back ?{" "}
            <u className="cursor-pointer" onClick={toggle}>
              Signup
            </u>
          </p>
        </div>
      )}
    </>
  );
}

export default AuthPage;
