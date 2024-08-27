import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { MdOutlineModeComment } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { useState } from "react";
import Loader from "./Loader";

export default function AnchorTemporaryDrawer({ post: posts }) {
  const [state, setState] = useState({ bottom: false });
  const [comment, setComment] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [post, setPost] = useState(posts);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
    return;
  };

  const handleReply = async (e, anchor) => {
    e.preventDefault();
    setIsReplying(true);
    try {
      const res = await fetch(`/api/posts/reply/${posts._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: comment }),
      });

      const data = await res.json();

      if (data.error) {
        setIsReplying(false);
        alert(data.error);
        return;
      }

      setIsReplying(false);
      setComment("");
      setPost({ ...post, replies: [data.replies, ...post.replies] });
      alert("Reply Sended...");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const list = (anchor) => (
    <Box sx={{ width: anchor === "bottom" ? "auto" : 250 }} role="presentation">
      <List>
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <div className="max-w-screen-2xl mx-auto w-full">
                <form className="needs-validation flex gap-x-5 ml-52">
                  <div className="mb-3 w-full">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Send Comment..."
                      required
                      style={{ width: "1000px", height: "40px" }}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                  <br />

                  <div className="flex gap-x-1">
                    <button
                      type="button"
                      className="btn btn-outline-dark me-2"
                      style={{ height: "40px" }}
                      onClick={() => {
                        handleReply(event);
                        // toggleDrawer(anchor, false)
                      }}
                    >
                      {isReplying ? <Loader /> : <IoSend />}
                    </button>
                  </div>
                </form>
              </div>
            </ListItemIcon>
            <ListItemText />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div className="h-10 w-10">
      {["bottom"].map((anchor) => (
        <React.Fragment key={anchor}>
          <MdOutlineModeComment
            className="w-6 h-6"
            onClick={toggleDrawer(anchor, true)}
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
