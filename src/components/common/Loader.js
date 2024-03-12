import { Box } from "@mui/material";
import React from "react";
import { PulseLoader } from "react-spinners";
export function Loader() {
  return (
    <Box
      sx={{
        width: "100%",
        justifyContent: "center",
        height: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <PulseLoader color="#36d7b7" size={15} />
    </Box>
  );
}
