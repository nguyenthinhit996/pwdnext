"use client";

import { Stack, Box } from "@mui/material";
import React from "react";
import DetailTaskComponent from "@/components/DetailTaks";
import { styled } from "@mui/system";
import { StyledStackLayOut } from "@/common/CustomizeMUI";

const DetailTask = () => {
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
        <DetailTaskComponent />
      </StyledStackLayOut>
    </Box>
  );
};

export default DetailTask;
