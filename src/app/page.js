"use client";

import TaskListItem from "@/components/TaskListItem";
import Box from "@mui/material/Box";
import SelectInput from "@/components/common/SelectInput";
import { useMemo, useState, useEffect } from "react";
import { mapStatusSelectOption, mapWarehouseSelectOption } from "@/util/Utils";
import TaskListTable from "@/components/TaskListTable";
import Typography from "@mui/material/Typography";
import axiosInstance from "@/config/axiosConfig";
import { mapStatusApiResult, getUserId } from "@/util/Utils";
import { STATUS_STASK } from "@/common/Text";
import FullScreenDialog from "@/common/DialogNotificationFullScreen";
import NavBar from "@/components/common/NavBar";
import { useTheme, useMediaQuery } from "@mui/material";
import { Guard } from "@/components/common/Guard.js";
import { PulseLoader } from "react-spinners";
const TaskList = () => {
  const theme = useTheme(); // Access the theme for breakpoint values

  // Define your media queries using MUI's breakpoint functions or custom queries
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Up to medium size screens

  const [filteredStatus, setFilteredStatus] = useState("ALL");
  const [filteredWarehouse, setFilteredWarehouse] = useState("ALL");
  const [data, setData] = useState([]);
  const [isLoadingData, setLoadingData] =  useState(true);

  const statusValues = useMemo(() => mapStatusSelectOption(), []);
  const warehouseValues = useMemo(() => mapWarehouseSelectOption(data), [data]);

  useEffect(() => {
    const userId = getUserId();
    (async () => {
      try {
        setLoadingData(true)
        const { data: resData } = await axiosInstance.get(
          `/users/${userId}/tasks`
        );
        setData(mapStatusApiResult(resData));
        setLoadingData(false)
      } catch (error) {}
    })();
  }, []);

  const finalData = useMemo(() => {
    const filteredData = data.filter(
      (t) =>
        (filteredStatus === "ALL" ||
          t?.status === STATUS_STASK[filteredStatus]) &&
        (filteredWarehouse === "ALL" || t?.warehouse === filteredWarehouse)
    );

    return filteredData.length === data.length ? data : filteredData;
  }, [data?.length, filteredStatus, filteredWarehouse]);

  console.log(finalData);

  return (
    <Guard>
      <NavBar />
      {isMobile && <FullScreenDialog />}
      <Box
        sx={{
          display: "felx",
          flexDirection: "column",
          mt: { xs: "0.5rem", sm: "2rem" },
          mx: { xs: "0.5rem", sm: "2rem" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "right", sm: "space-between" },
            alignItems: "center",
            mb: "2rem",
          }}
          id="heading"
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              ml: "1rem",
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >
            List task
          </Typography>
          <Box id="drop-down" sx={{ display: "flex", justifyContent: "end" }}>
            <SelectInput
              items={statusValues}
              value={filteredStatus}
              handleChange={setFilteredStatus}
            />

            <SelectInput
              items={warehouseValues}
              value={filteredWarehouse}
              handleChange={setFilteredWarehouse}
            />
          </Box>
        </Box>

        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          {finalData.length > 0
            ? finalData.map((item) => (
                <TaskListItem task={item} key={item.id} />
              ))
            : null}
          {finalData.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                marginTop: "140px",
              }}
            >
              <PulseLoader color="#36d7b7" size={15} />
            </Box>
          ) : null}
        </Box>

        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <TaskListTable tasks={finalData} isLoadingData={isLoadingData} />
        </Box>
      </Box>
    </Guard>
  );
};

export default TaskList;
