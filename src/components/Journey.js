import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import ImageListItem from "@mui/material/ImageListItem";
import Image from "next/image";
import { TextareaCus, ButtonPrimary } from "@/common/CustomizeMUI";
import HorizontalLinearStepper from "@/common/HorizontalLinearStepper";
import { useEffect, useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Try } from "@mui/icons-material";
import axiosInstance from "@/config/axiosConfig";

const mockData = {
  idtask: 12,
  currentStep: 0,
  isDone: false,
  steps: [
    {
      stepNumber: 0,
      description: "Move to HCM WareHouse",
      address: "111 Nguyễn Ðình Chính, Phường 15, Quận Phú Nhuận",
      noticed: "",
    },
    {
      stepNumber: 1,
      description: "Move to Customer Address",
      address:
        "Chi nhánh 6 (Lab 6): Tòa nhà TMA, Công viên phần mềm Quang Trung, P. Tân Chánh Hiệp, Quận 12",
      noticed: "",
    },
    {
      stepNumber: 2,
      description: "Move back Station",
      address:
        "Chi nhánh 6 (Lab 6): Tòa nhà TMA, Công viên phần mềm Quang Trung, P. Tân Chánh Hiệp, Quận 12",
      noticed: "",
    },
  ],
};

const listImage = {
  0: "/assets/img/step1.png",
  1: "/assets/img/step2.png",
  2: "/assets/img/step3.png",
};

const JourneyComponent = (props) => {
  const theme = useTheme(); // Access the theme for breakpoint values
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  console.log(id);

  // Define your media queries using MUI's breakpoint functions or custom queries
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Up to medium size screens

  const [dataForm, setDataForm] = useState();
  let currentStepData = dataForm?.steps[dataForm?.currentStep] || {};

  const handleOnClick = (currentStepInput) => {
    currentStepInput = currentStepInput + 1;
    console.log("currentStepInput ", currentStepInput);
    if (currentStepInput === dataForm.steps.length) {
      console.log(" dataForm.steps.length ", dataForm.steps.length);
      setDataForm({
        ...dataForm,
        currentStep: currentStepInput,
        isDone: true,
      });
    } else {
      setDataForm({
        ...dataForm,
        currentStep: currentStepInput,
      });
    }
  };

  const handleOnClickBackToHomeScreen = () => {
    router.push(`/tasks/${id}/detail`);
  };

  useEffect(() => {
    const getTaskDetail = async () => {
      try {
        const { data } = await axiosInstance.get(`/tasks/${id}`);
        setDataForm({ ...data?.instruction, currentStep: 0 });
      } catch (err) {
        console.log(err);
      }
    };

    getTaskDetail();
  }, [id]);

  const renderProcess = () => {
    return (
      <Stack
        justifyContent={"space-evenly"}
        flexDirection={"column"}
        gap="1rem"
        padding={"1rem"}
      >
        <Box>
          <p>{` Step ${dataForm?.currentStep + 1} of ${
            dataForm?.steps?.length
          } `}</p>
          <Typography variant="h5">{currentStepData?.description}</Typography>

          {isMobile ? (
            <p>{currentStepData?.address}</p>
          ) : (
            <Typography variant="h6">{currentStepData?.address}</Typography>
          )}
        </Box>
        <Stack alignItems="center" justifyContent="center">
          <Box
            component="img"
            src={listImage[dataForm?.currentStep]}
            alt=""
            sx={{
              height: {
                lg: "350px",
                md: "350px",
                sm: "250px",
                xs: "160px",
              },
            }}
          />
        </Stack>
        <Box>
          <Typography>Note</Typography>
          <TextareaCus minRows="5" sx={{ width: "100%" }} />
        </Box>
        <ButtonPrimary onClick={() => handleOnClick(dataForm.currentStep)}>
          Continue
        </ButtonPrimary>
      </Stack>
    );
  };

  const renderFinish = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          height: "70vh",
        }}
      >
        <Typography variant="h4">Your are doing well</Typography>
        <Box>
          <img src="/assets/img/sticker.png" />
        </Box>
        <span></span>
        <ButtonPrimary
          sx={{ width: "100%" }}
          onClick={handleOnClickBackToHomeScreen}
        >
          Back To Home Screen
        </ButtonPrimary>
      </Box>
    );
  };

  return (
    <Stack
      sx={{
        [theme.breakpoints.up("sm")]: {
          //600px
          width: "100%",
          pr: "2rem",
          pl: "2rem",
        },
        [theme.breakpoints.up("md")]: {
          //900px
          minWidth: theme.breakpoints.values.md,
        },
        mt: "2rem",
      }}
      flexDirection={"column"}
      justifyContent={"space-evenly"}
      gap={"2rem"}
    >
      <Box>
        <HorizontalLinearStepper
          activeStep={dataForm?.currentStep}
        ></HorizontalLinearStepper>
      </Box>
      {dataForm?.isDone ? renderFinish() : renderProcess()}
    </Stack>
  );
};

export default JourneyComponent;
