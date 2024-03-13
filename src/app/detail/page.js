"use client";

import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import DetailTaskComponent from "@/components/DetailTaks";
import { StyledStackLayOut } from "@/common/CustomizeMUI";
import JourneyComponent from "@/components/Journey";
import { formatDatetime, TASK_LOCAL_KEY } from "@/util/Utils";

const currentStepMap = {
  DRAFT: 0,
  STEP2: 1,
  STEP3: 2,
};

const DetailTask = () => {
  const [task, setTask] = useState({});
  const [error, setError] = useState();
  const [isStart, setIsStart] = useState(false);

  const getTaskDetail = async () => {
    try {
      const storedValue = localStorage.getItem(TASK_LOCAL_KEY);
      if (storedValue) {
        const data = JSON.parse(storedValue);
        const formatData = {
          ...data,
          deliveryDate: formatDatetime(data.due_date),
          estimation_in_hours: data.estimation_in_hours + ":00",
        };
        setTask(formatData);
      } else setError("Not found");
    } catch (err) {
      setError(err.response?.data);
    }
  };

  const handleOnClick = async () => {
    setIsStart(true);
  };

  useEffect(() => {
    getTaskDetail();
  }, []);

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
        {isStart ? (
          <JourneyComponent
            taskId={task.id}
            data={task}
            currentStep={currentStepMap[task?.status]}
          />
        ) : (
          <DetailTaskComponent
            data={task}
            error={error}
            handleOnClick={handleOnClick}
          />
        )}
      </StyledStackLayOut>
    </Box>
  );
};

export default DetailTask;
