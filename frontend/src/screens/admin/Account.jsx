import React, { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Sidebar from "./Sidebar";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../configs/firebase";
import { useAuth } from "@arcana/auth-react";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { providers, Contract } from "ethers";
import { apniBachatConractAddress, ocrSpaceKey } from "../../constants";
import ApniBachat from "../../artifacts/contracts/ApniBachat.sol/ApniBachat.json";
import { arcanaProvider } from "../../index";
import CustomizedDialogs from "../../components/CustomizedDialogs";

import axios from "axios";

const Card = (props) => {
  const navigate = useNavigate();
  return (
    <>
      <Paper
        elevation={3}
        sx={{
          width: "90%",
          height: "auto",
          background:
            "linear-gradient(91.47deg, rgba(201, 72, 247, 0.39) 0.58%, rgba(143, 0, 167, 0.39) 95.65%)",
          border: "2px solid #000",
          borderRadius: "13px",
          backdropFilter: "blur(5px)",
        }}
      >
        <div className="flex justify-between items-start px-10 py-5">
          <div className="flex flex-col justify-center items-between pb-5">
            <Typography
              variant="h4"
              component="h2"
              color="primary.contrastText"
              sx={{
                fontSize: "1.75rem",
                fontWeight: "bold",
                color: "#000",
                textAlign: "left",
                pt: 2.5,
                pl: 2,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {props.title}
            </Typography>
            <div className="pl-4 mt-[1.5rem] flex flex-col justify-center items-start gap-1">
              <Typography
                variant="h4"
                component="h2"
                color="black"
                sx={{
                  fontSize: "1.25rem",
                  color: "black",
                  textAlign: "center",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                PAN: {props.pan}
              </Typography>
              <Typography
                variant="h4"
                component="h2"
                color="black"
                sx={{
                  fontSize: "1.25rem",
                  color: "black",
                  textAlign: "center",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Phone: {props.mobile}
              </Typography>
              <Typography
                variant="h4"
                component="h2"
                color="black"
                sx={{
                  fontSize: "1.25rem",
                  color: "black",
                  textAlign: "center",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Income: {props.income}
              </Typography>
            </div>
          </div>
          {props.children}
        </div>
      </Paper>
    </>
  );
};

const OcrSpaceApi = () => {
  const [data, setData] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://api.ocr.space/parse/image", {
        apikey: "YOUR_API_KEY",
        url: "IMAGE_URL",
      });
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button type="submit">Send Request</button>
      </form>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
};

const RequestItem = (props) => {
  const provider = new providers.Web3Provider(arcanaProvider.provider);
  // get the end user
  const signer = provider.getSigner();
  // get the smart contract
  const contract = new Contract(
    apniBachatConractAddress,
    ApniBachat.abi,
    signer
  );

  const [data, setData] = useState("");

  const [modal, setModal] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [error, setError] = useState(null);

  const onClickApprove = async () => {
    setModal(true);

    await arcanaProvider.connect();
    const personalData = {
      name: props.name,
      dateOfBirth: "01-01-1980",
      panNumber: props.pan,
    };

    setStepCount((prev) => prev + 1);

    await contract.enroll(personalData, personalData.panNumber, {
      employerName: props.name,
      occupation: "SWE",
      incomePerYear: props.income,
    });

    props.approve(props.id);

    setStepCount((prev) => prev + 1);
  };

  const onClickOcr = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://api8.ocr.space/parse/image", {
        apikey: ocrSpaceKey,
        url: "https://img.freepik.com/free-vector/stylish-indian-flag-design_1394-725.jpg?w=1380&t=st=1677981733~exp=1677982333~hmac=e0f4ca8468321f9b8605c163aa79a74f9224065df607a3066969c64bb3716485",
      });
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Card
        title={props.name}
        pan={props.pan}
        phone={props.mobile}
        income={props.income}
      >
        <CustomizedDialogs
          open={modal}
          setOpen={setModal}
          stepCount={stepCount}
          error={error}
          steps={[
            "Initiating contract interaction",
            "Transacting with Apni Bachat smart contract",
            "Success",
          ]}
        />
        <div className="flex flex-col gap-6 items-end">
          <div className="flex">
            <Button
              variant="contained"
              onClick={onClickApprove}
              sx={{
                disableRipple: true,
                width: "100px",
                background:
                  "linear-gradient(91.47deg, rgba(201, 72, 247, 0.39) 0.58%, rgba(143, 0, 167, 0.39) 95.65%)",
                height: "50px",
                color: "#000",
                border: "2px solid #000",
                borderRadius: "10px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: "bold",
                fontSize: "1.2rem",
                textTransform: "none",
                marginTop: "1rem",
                marginRight: "1rem",
              }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              onClick={onClickOcr}
              sx={{
                disableRipple: true,
                width: "100px",
                background:
                  "linear-gradient(91.47deg, rgba(201, 72, 247, 0.39) 0.58%, rgba(143, 0, 167, 0.39) 95.65%)",
                height: "50px",
                color: "#000",
                border: "2px solid #000",
                borderRadius: "10px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: "bold",
                fontSize: "1.2rem",
                textTransform: "none",
                marginTop: "1rem",
                marginRight: "1rem",
              }}
            >
              OCR
            </Button>
          </div>
          <div className="flex my-2 justify-center items-center">
            <img
              src={props.signatureImg}
              alt="signature"
              className="h-12 border-2 border-black rounded-lg mr-[1rem]"
            />
            <Button
              variant="contained"
              sx={{
                disableRipple: true,
                width: "100px",
                background:
                  "linear-gradient(91.47deg, rgba(201, 72, 247, 0.39) 0.58%, rgba(143, 0, 167, 0.39) 95.65%)",
                height: "50px",
                color: "#000",
                border: "2px solid #000",
                borderRadius: "10px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: "bold",
                fontSize: "1.2rem",
                textTransform: "none",
                marginRight: "1rem",
              }}
            >
              <a href={props.panImg} target="_blank">
                Pan
              </a>
            </Button>
            <Button
              variant="contained"
              sx={{
                disableRipple: true,
                width: "100px",
                background:
                  "linear-gradient(91.47deg, rgba(201, 72, 247, 0.39) 0.58%, rgba(143, 0, 167, 0.39) 95.65%)",
                height: "50px",
                color: "#000",
                border: "2px solid #000",
                borderRadius: "10px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: "bold",
                fontSize: "1.2rem",
                textTransform: "none",
                marginRight: "1rem",
              }}
            >
              <a href={props.aadharImg} target="_blank">
                Aadhar
              </a>
            </Button>
            <Button
              variant="contained"
              sx={{
                disableRipple: true,
                width: "100px",
                background:
                  "linear-gradient(91.47deg, rgba(201, 72, 247, 0.39) 0.58%, rgba(143, 0, 167, 0.39) 95.65%)",
                height: "50px",
                color: "#000",
                border: "2px solid #000",
                borderRadius: "10px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: "bold",
                fontSize: "1.2rem",
                textTransform: "none",
                marginRight: "1rem",
              }}
            >
              <a href={props.incomeImg} target="_blank">
                Income
              </a>
            </Button>
            {/* <div>{JSON.stringify(data)}</div> */}
          </div>
        </div>
      </Card>
    </>
  );
};
function Account() {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    if (!auth.user) return;
    const getProperties = async () => {
      const snapshot = await getDocs(collection(db, "user"));
      let tData = [];
      snapshot.forEach((doc) => {
        let temp = doc.data();
        console.log(temp);
        if (!temp.kyc_done) {
          tData.push({ ...doc.data(), id: doc.id });
        }
      });
      setData(tData);
    };
    getProperties();
  }, [auth]);
  useEffect(() => {
    console.log(data);
    setLoading(true);
    if (data) setLoading(false);
  }, [data]);
  const approve = async (id) => {
    await updateDoc(doc(db, "user", id), {
      kyc_done: true,
    });
    setData(data.filter((item) => item.id !== id));
  };
  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-[#2e2e2e69] z-50 flex justify-center items-center">
          <CircularProgress />
        </div>
      )}
      <Box
        sx={{ display: "flex", width: "100vw", height: "100vh" }}
        className="admin-bg"
      >
        <Sidebar />
        <div className="flex flex-col justify-start items-start w-[70%]">
          <Typography
            variant="h4"
            color="black"
            sx={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              textAlign: "center",
              textShadow: "0px 5px 4px rgba(0, 0, 0, 0.36)",
              fontFamily: "Poppins, sans-serif",
              letterSpacing: "0.1rem",
              my: "5rem",
              mb: "4rem",
              ml: "5rem",
            }}
          >
            Account KYC Requests
          </Typography>
          <div className="flex-[8] flex w-full justify-start items-center flex-col gap-4 pt-2 overflow-y-auto">
            {(!data || data.length === 0) && (
              <div className="w-[90%] bg-white p-5 text-2xl flex justify-start items-start">
                <h1 className="text-left ml">No requests</h1>
              </div>
            )}
            {data?.map((item) => (
              <RequestItem approve={approve} {...item} />
            ))}
          </div>
        </div>
      </Box>
    </>
  );
}

export default Account;
