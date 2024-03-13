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
import { requestPermission, udpateTokenDeviceId } from "@/util/Notification";
import BedgeStatus from "@/common/BadgeStatus";
import { useContext } from "react";
import axiosInstance from "@/config/axiosConfig";
import { Box } from "@mui/material";
import { ModalContext } from "@/context/ModalContext";
import { getUserId, TASK_LOCAL_KEY } from "@/util/Utils";
import { useState } from "react";

const TaskListTable = ({ tasks = [], isLoadingData = true }) => {
  const router = useRouter();
  const { handleOnMessage } = useContext(ModalContext);

  const handleClickDetail = async (id) => {
    try {
      const { data = {} } = await axiosInstance.get(`/tasks/${id}`);
      localStorage.setItem(TASK_LOCAL_KEY, JSON.stringify(data));
      router.push("/detail");
    } catch (error) {
      console.log(error);
    }
  };
  const firstLoad = React.useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      requestPermission(handleOnMessage, udpateTokenDeviceId);
    }
  }, [firstLoad.current]);
  const renderEmptyContent = () => {
    if (isLoadingData && tasks.length === 0) {
      return (
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
      );
    } else if (!isLoadingData && tasks.length === 0) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginTop: "30px",
          }}
        >
          No matching records found
        </Box>
      );
    }
  };

  return (
    <Box>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Task Name</TableCell>
            <TableCell align="left">Warehouse</TableCell>
            <TableCell align="left">Delivery Date</TableCell>
            <TableCell align="left">Delivery&nbsp;time</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
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
              <TableCell align="left">{row.estimation_in_hours}</TableCell>
              <TableCell align="center">
                <BedgeStatus status={row.status} />
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Details" placement="top-start">
                  <IconButton
                    aria-label="arrow"
                    onClick={() => handleClickDetail(row.id)}
                  >
                    <ArrowRightAltIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {renderEmptyContent()}
    </Box>
  );
};

export default TaskListTable;
