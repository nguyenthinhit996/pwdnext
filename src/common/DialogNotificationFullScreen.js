"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import { ModalContext } from "@/context/ModalContext";
import { useContext } from "react";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Stack } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import Popover from "@mui/material/Popover";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
  const { setOpen, open } = useContext(ModalContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openFilter, setFilter] = React.useState(false);

  const handleClickFilter = (event) => {
    setFilter(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setFilter(false);
    setAnchorEl(null);
  };

  return (
    <Box>
      <Popover
        open={openFilter}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List>
          <ListItemButton>
            <ListItemText primary="All" />
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemText primary="UnRead" />
          </ListItemButton>
        </List>
      </Popover>
      <Dialog
        fullScreen
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={Transition}
        direction="left"
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#42a5f5",
            }}
          >
            <Stack
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"space-evenly"}
            >
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setOpen(false)}
                aria-label="close"
              >
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h6">Notifications</Typography>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleClickFilter}
                aria-label="close"
              >
                <FilterListIcon />
              </IconButton>
            </Stack>

            <Button autoFocus color="inherit" onClick={() => {}}>
              <DoneAllIcon />
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItemButton>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemText
              primary="Default notification ringtone"
              secondary="Tethys"
            />
          </ListItemButton>
        </List>
      </Dialog>
    </Box>
  );
}
