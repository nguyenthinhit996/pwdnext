"use client";

import NavBar from "@/components/common/NavBar";
import FullScreenDialog from "@/common/DialogNotificationFullScreen";
import { useTheme, useMediaQuery } from "@mui/material";

export default function TaskLayout({ children }) {
  const theme = useTheme(); // Access the theme for breakpoint values

  // Define your media queries using MUI's breakpoint functions or custom queries
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Up to medium size screens

  return (
    <>
      <NavBar />
      {isMobile && <FullScreenDialog />}
      {children}
    </>
  );
}