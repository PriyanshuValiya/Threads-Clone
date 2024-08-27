import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

function SkeletonChildrenDemo(props) {
  const { loading = false } = props;

  return (
    <div className="pt-3 pl-2">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ margin: 1 }}>
          <Skeleton variant="circular">
            <Avatar />
          </Skeleton>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Skeleton width="40%">
            <Typography>.</Typography>
          </Skeleton>
          <Skeleton width="80%">
            <Typography>.</Typography>
          </Skeleton>
        </Box>
      </Box>
    </div>
  );
}

SkeletonChildrenDemo.propTypes = {
  loading: PropTypes.bool,
};

export default function SkeletonChildren() {
  return (
    <Grid item xs>
      <SkeletonChildrenDemo loading />
    </Grid>
  );
}
