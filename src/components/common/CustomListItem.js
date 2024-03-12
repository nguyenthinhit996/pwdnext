"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Divider, styled, Badge } from "@mui/material";
import { useRouter } from "next/navigation";
import { ModalContext } from "@/context/ModalContext";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export default function CustomListItem({ notifications }) {
  const { handleViewMessage } = React.useContext(ModalContext);
  const router = useRouter();
  const [first, ...rest] = notifications;

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <nav aria-label="main mailbox folders">
        <List sx={{ display: "flex", flexDirection: "column" }}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            variant="dot"
            sx={{
              "& .MuiBadge-dot": {
                top: "50%",
                left: 30,
              },
            }}
          >
            <ListItemButton
              onClick={() => {
                handleViewMessage(msg.id);
                msg?.body?.taskId &&
                  router.push(`/tasks/${first.taskId}/detail`);
              }}
            >
              <ListItemText
                sx={{ ml: 4 }}
                primary={first.title}
                secondary={first.text}
              />
            </ListItemButton>
          </StyledBadge>
          <Divider />
          {rest?.map((msg) => {
            return (
              <ListItemButton
                onClick={() => {
                  handleViewMessage(msg.id);
                  msg?.body?.taskId &&
                    router.push(`/tasks/${msg.taskId}/detail`);
                }}
              >
                <ListItemText
                  sx={{ ml: 4 }}
                  primary={msg.title}
                  secondary={msg.text}
                />
              </ListItemButton>
            );
          })}
        </List>
      </nav>
    </Box>
  );
}
