import "bootstrap/dist/css/bootstrap.min.css";
const src =
  "https://logos-world.net/wp-content/uploads/2023/07/Threads-Logo.png";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import LogoutBtn from "./LogoutBtn";
import { Link } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import { IoChatboxOutline } from "react-icons/io5";
import { MdPersonAddAlt1 } from "react-icons/md";

function Header() {
  const currUser = JSON.parse(localStorage.getItem("user-threads"));
  const user = useRecoilState(userAtom);

  return (
    <>
      <div className="container sticky top-0 z-10 bg-white">
        <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
          <div className="col-md-3 mb-2 mb-md-0">
            <a
              href="/"
              className="d-inline-flex link-body-emphasis text-decoration-none"
            >
              <img className="w-16 h-10" src={src} alt="Logo" />
            </a>
          </div>

          <div className="flex gap-x-5 col-md-2 text-end">
            {currUser && (
              <div className="flex gap-x-5 float-start">
                <Link to={"/getsuggetion"}>
                  <MdPersonAddAlt1 className="w-10 h-10 float-left" />
                </Link>
                <Link to={"/chat"}>
                  <IoChatboxOutline className="w-10 h-10 float-left" />
                </Link>
                <Link to={`/${user[0]?.username}`}>
                  <MdAccountCircle className="w-10 h-10 float-left" />
                </Link>
              </div>
            )}
            {user[0] !== null ? (
              <div>
                <LogoutBtn />
              </div>
            ) : (
              ""
            )}
          </div>
        </header>
      </div>
    </>
  );
}

export default Header;
