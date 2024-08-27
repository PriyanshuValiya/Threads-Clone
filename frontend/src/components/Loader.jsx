import CircularProgress from "@mui/material/CircularProgress";

function Loader() {
  return (
    <CircularProgress
      className="mr-1"
      color="inherit"
      style={{ height: "15px", width: "15px" }}
    />
  );
}

export default Loader;
