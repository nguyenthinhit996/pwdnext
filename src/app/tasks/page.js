"use client";

import TaskListItem from "@/components/TaskListItem";
import Box from "@mui/material/Box";
import SelectInput from "@/components/common/SelectInput";
import { useMemo, useState, useEffect } from "react";
import { mapStatusSelectOption, mapWarehouseSelectOption } from "@/util/Utils";
import TaskListTable from "@/components/TaskListTable";
import Typography from "@mui/material/Typography";
import axiosInstance from "@/config/axiosConfig";
import { mapStatusApiResult } from "@/util/Utils";
import { STATUS_STASK } from "@/common/Text";

const TaskList = () => {
  const [filteredStatus, setFilteredStatus] = useState("ALL");
  const [filteredWarehouse, setFilteredWarehouse] = useState("ALL");
  const [data, setData] = useState([]);

  const statusValues = useMemo(() => mapStatusSelectOption(), []);
  const warehouseValues = useMemo(() => mapWarehouseSelectOption(data), [data]);

  useEffect(() => {
    (async () => {
      try {
        const { data: resData } = await axiosInstance.get("/tasks");
        setData(mapStatusApiResult(resData));
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
    <Box
      sx={{
        display: "felx",
        flexDirection: "column",
        mt: "2rem",
        ml: "2rem",
        mr: "2rem",
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
        {finalData.map((item) => (
          <TaskListItem task={item} key={item.id} />
        ))}
      </Box>

      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <TaskListTable tasks={finalData} />
      </Box>
    </Box>
  );
};

export default TaskList;
