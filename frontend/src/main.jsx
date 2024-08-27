import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { SocketContextProvider } from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <RecoilRoot>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </RecoilRoot>
  </BrowserRouter>
);
