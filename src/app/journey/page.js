"use client";

import { useSearchParams } from "next/navigation";

import { Stack, Box } from "@mui/material";
import React from "react";
import DetailTaskComponent from "@/components/DetailTaks";
import { styled } from "@mui/system";
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
