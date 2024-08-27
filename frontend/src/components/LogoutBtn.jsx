import "bootstrap/dist/css/bootstrap.min.css";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom.js";
import { useNavigate } from "react-router-dom";

function LogoutBtn() {
  const setUser = useSetRecoilState(userAtom);
  const nevigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      localStorage.removeItem("user-threads");
      setUser(null);
      nevigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button className="btn btn-dark" onClick={handleLogout}>
        Logout
      </button>
    </>
  );
}

export default LogoutBtn;
