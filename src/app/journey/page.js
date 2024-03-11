"use client";

import { Box } from "@mui/material";
import React from "react";
import JourneyComponent from "@/components/Journey";
import { StyledStackLayOut } from "@/common/CustomizeMUI";

const Journey = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <StyledStackLayOut>
        <JourneyComponent></JourneyComponent>
      </StyledStackLayOut>
    </Box>
  );
};

export default Journey;
