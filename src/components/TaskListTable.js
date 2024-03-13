import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/navigation";
import { PulseLoader } from "react-spinners";
import { useEffect } from "react";
import { requestPermission, getTokenFirebase } from "@/util/Notification";
import BedgeStatus from "@/common/BadgeStatus";
import { useContext } from "react";
import axiosInstance from "@/config/axiosConfig";
import { Box } from "@mui/material";
import { ModalContext } from "@/context/ModalContext";
import { getUserId } from "@/util/Utils";

const TaskListTable = ({ tasks = [] }) => {
  const router = useRouter();
  const { handleOnMessage } = useContext(ModalContext);
  const userId = getUserId();

  const cb2 = async (...rest) => {
    console.log("rest  ", rest);

    const payload = {
      deviceId: rest?.[0],
    };

    console.log("payload  ", payload);
    console.log("id  ", userId);

    await axiosInstance.put(`/users/${userId}`, payload);
  };

  useEffect(() => {
    if (Notification.permission === "granted") {
      console.log("Notification permission granted. getToken now");
      getTokenFirebase(cb2);
    } else {
      // User denied permission
      console.log("Notification permission denied. requestPermission now");
      requestPermission(handleOnMessage, cb2);
    }
  }, []);

  return (
    <Box>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name task</TableCell>
            <TableCell align="left">Name&nbsp;warhouse</TableCell>
            <TableCell align="left">Due&nbsp;date</TableCell>
            <TableCell align="left">Delivery&nbsp;time</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        {tasks.length > 0 ? (
          <TableBody>
            {tasks.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="left">{row.warehouse}</TableCell>
                <TableCell align="left">{row.due_date}</TableCell>
                <TableCell align="left">
                  {row.estimation_in_hours} Hour(s)
                </TableCell>
                <TableCell align="center">
                  <BedgeStatus status={row.status} />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Details" placement="top-start">
                    <IconButton
                      aria-label="arrow"
                      onClick={() => router.push(`/tasks/${row.id}/detail`)}
                    >
                      <ArrowRightAltIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : null}
      </Table>
      {tasks.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginTop: "30px",
          }}
        >
          <PulseLoader color="#36d7b7" size={15} />
        </Box>
      ) : null}
    </Box>
  );
};

export default TaskListTable;
