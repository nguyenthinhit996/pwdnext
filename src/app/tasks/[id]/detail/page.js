"use client";

import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import DetailTaskComponent from "@/components/DetailTaks";
import { StyledStackLayOut } from "@/common/CustomizeMUI";
import axiosInstance from "@/config/axiosConfig";
import { AuthContext } from "@/context/AuthContext";

const DetailTask = ({ params }) => {
  const id = params.id;
  const [task, setTask] = useState({});
  const [error, setError] = useState();
  const { user } = useContext(AuthContext);
  console.log(user?.userId);

  const getTaskDetail = async () => {
    try {
      const { data } = await axiosInstance.get(`/tasks/${id}`);
      const formatData = {
        ...data,
        deliveryDate: new Date(data.due_date).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZone: "UTC",
        }),
      };
      setTask(formatData);
    } catch (err) {
      setError(err.response?.data);
    }
  };

  const handleOnClick = async () => {
    try {
      const { data } = await axiosInstance.put(`/tasks/${id}/self-assign`, {
        userId: user?.userId,
      });
      if (data) {
        let url = "/journey?id=" + data?.id;
        router.push(url);
      }
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
