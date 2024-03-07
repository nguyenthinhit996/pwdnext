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

import BedgeStatus from "@/common/BadgeStatus";

const TaskListTable = ({ tasks = [] }) => {
  const router = useRouter();

  return (
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
    </Table>
  );
};

export default TaskListTable;
