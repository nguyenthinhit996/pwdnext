"use client";

import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DetailTaskComponent from "@/components/DetailTaks";
import { StyledStackLayOut } from "@/common/CustomizeMUI";
import axiosInstance from "@/config/axiosConfig";
import { AuthContext } from "@/context/AuthContext";
import { formatDatetime } from "@/util/Utils";

const DetailTask = ({ params }) => {
  const id = params.id;
  const [task, setTask] = useState({});
  const [error, setError] = useState();
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const getTaskDetail = async () => {
    try {
      const { data } = await axiosInstance.get(`/tasks/${id}`);
      const formatData = {
        ...data,
        deliveryDate: formatDatetime(data.due_date),
        estimation_in_hours: data.estimation_in_hours + ":00",
      };
      setTask(formatData);
    } catch (err) {
      setError(err.response?.data);
    }
  };

  const handleOnClick = async () => {
    try {
      let url = `/journey?id=${task.id}`;
      router.push(url);
    } catch (err) {
      setError(err.response?.data);
    }
  };

  useEffect(() => {
    getTaskDetail();
  }, [id]);

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
        <DetailTaskComponent
          data={task}
          error={error}
          handleOnClick={handleOnClick}
        />
      </StyledStackLayOut>
    </Box>
  );
};

export default DetailTask;
