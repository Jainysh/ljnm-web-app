import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  getHotiDetailById,
  getAllYatriDetailsById,
} from "../../firebase/service";
import { Hoti } from "../../types/hoti";
import HotiDetailsPage from "../../components/HotiDetailsPage";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  Skeleton,
  Typography,
} from "@mui/material";
import { LJNMColors } from "../../styles";
import { ArrowForwardIos } from "@mui/icons-material";
import { HotiAllocationDetail } from "../../types/hotiAllocationDetail";
import { YatriDetails } from "../../types/yatriDetails";
import { onSnapshot, Unsubscribe, doc } from "firebase/firestore";
import {
  firebaseAuth,
  getFirebaseFirestoreDB,
  getInvisibleRecaptchaVerifier,
  getSignInWithPhoneNumber,
} from "../../firebase";
import { isMobileInvalidNumber } from "../../components/TicketDetails";
import { getHumanErrorMessage } from "../../lib/helper";
import { onAuthStateChanged, User } from "firebase/auth";

const HomeComponent = () => {
  const [hotiNumber, setHotiNumber] = useState(-1);
  const [mobile, setMobile] = useState("");
  const [hotiDetails, setHotiDetails] = useState<Hoti>({} as Hoti);
  const [yatriDetails, setYatriDetails] = useState<YatriDetails[]>(
    [] as YatriDetails[]
  );
  const [hotiAllocationDetails, setHotiAllocationDetails] =
    useState<HotiAllocationDetail>({} as HotiAllocationDetail);
  const [errorField, setErrorField] = useState("");

  const [showLoader, setShowLoader] = useState(false);

  const [loadingUserInfo, setLoadingUserInfo] = useState(true);

  const [otpRequestObject, setOtpRequestObject] = useState<any>({});
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const getHotiDetails = async () => {
    if (firebaseAuth.currentUser) {
      console.log("user", firebaseAuth.currentUser);
      return;
    }
    if (!hotiNumber || hotiNumber <= 0 || hotiNumber >= 224) {
      setErrorField("hotiNumber");
      return;
    }
    console.log(mobile, isMobileInvalidNumber(mobile));
    if (!mobile || isMobileInvalidNumber(mobile)) {
      setErrorField("mobile");
      return;
    }
    setShowLoader(true);

    const hotiDetails = await getHotiDetailById(mobile, hotiNumber);
    if (hotiDetails.hotiId) {
      const invisibleRecaptchaVerifier = getInvisibleRecaptchaVerifier();
      try {
        const otpRequest = await getSignInWithPhoneNumber(
          `+91${mobile}`,
          invisibleRecaptchaVerifier
        );
        setOtpRequestObject(otpRequest);
        setPhoneNumberErrorMessage("");
        console.log(otpRequest);
        setShowModal(true);
      } catch (error: any) {
        const errorMessageToShow = getHumanErrorMessage(error.code);
        // TODO: handle error message
        setPhoneNumberErrorMessage(errorMessageToShow);
        setErrorField("authError");
        console.log(error);
      }
      // setHotiDetails(hotiDetails);
    } else {
      setErrorField("noData");
    }
    setShowLoader(false);
  };

  const [otpNumber, setOtpNumber] = useState("");
  const [validatingOTP, setValidatingOTP] = useState(false);

  const validateOTP = async () => {
    setValidatingOTP(true);
    try {
      const result = await otpRequestObject.confirm(otpNumber);
      const user = result.user;
      if (user) {
        console.log(user, result);
        await loadHotiDetailsByMobileNumber(user, setHotiDetails);
      }
      setValidatingOTP(false);
      setShowModal(false);
      setMobile("");
      setOtpNumber("");
    } catch (error: any) {
      console.log("error", error);
      const errorMessageToShow = getHumanErrorMessage(error.code);
      // TODO: handle error message
      setPhoneNumberErrorMessage(errorMessageToShow);
      setErrorField("authError");
      setValidatingOTP(false);
      setOtpNumber(""); //not working; TODO: need to fix
    }
  };

  const clearHotiDetails = () => {
    firebaseAuth.signOut();
    setHotiDetails({} as Hoti);
  };

  const updateHotiDetails = (e: any) => {
    const hotiNumber = e.target.value;
    if (hotiNumber <= 0 || hotiNumber >= 224) {
      setErrorField("hotiNumber");
    } else {
      setErrorField("");
    }
    setHotiNumber(hotiNumber);
  };

  const handleSubmit = (e: any) => {
    if (e.key === "Enter") {
      getHotiDetails();
    }
  };

  const updatePhoneNumber = (e: any) => {
    if (e.target.value.length > 10) {
      return;
    }
    setErrorField("");
    setMobile(e.target.value);
  };

  useEffect(() => {
    let authUnsubscribe: Unsubscribe;
    const doExecute = async () => {
      if (firebaseAuth.currentUser?.phoneNumber) {
        await loadHotiDetailsByMobileNumber(
          firebaseAuth.currentUser,
          setHotiDetails
        );
        setLoadingUserInfo(false);
      } else {
        authUnsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
          if (user) {
            // User is signed in
            if (user.phoneNumber) {
              await loadHotiDetailsByMobileNumber(user, setHotiDetails);
            }
            setLoadingUserInfo(false);
          } else {
            setLoadingUserInfo(false);
          }
        });
      }
    };
    doExecute();
    return () => {
      authUnsubscribe && authUnsubscribe();
    };
  }, []);

  const handleOTPChange = (e: any) => {
    if (e.target.value.length <= 6) {
      setErrorField("");
      setPhoneNumberErrorMessage("");
      setOtpNumber(e.target.value);
    }
  };

  useEffect(() => {
    let hotiDetailsUnsubscribe: Unsubscribe;
    const doExecute = async () => {
      hotiDetailsUnsubscribe = onSnapshot(
        doc(
          await getFirebaseFirestoreDB(),
          `EventMaster/event-1/hotiAllocation/hoti-${hotiDetails.hotiId}`
        ),
        async (doc) => {
          const hotiAllocationDetails = doc.data();
          if (hotiAllocationDetails) {
            setHotiAllocationDetails(
              hotiAllocationDetails as HotiAllocationDetail
            );
            const yatriDetails = await getAllYatriDetailsById(
              hotiDetails.hotiId
            );
            setYatriDetails(yatriDetails);
          }
        }
      );
    };
    doExecute();
    return () => {
      hotiDetailsUnsubscribe && hotiDetailsUnsubscribe();
    };
  }, [hotiDetails.hotiId]);

  return (
    <>
      {!hotiDetails.name ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          height="100vh"
        >
          <Grid container justifyContent="center">
            <Grid item lg={6} md={8} xs={12}>
              <Box
                borderBottom={`1px solid ${LJNMColors.secondary}`}
                borderLeft="none"
                borderRight="none"
                display="flex"
                flexDirection="column"
                alignItems="center"
                margin="8px"
                paddingY="8px"
              >
                <Box width="100px" height="100px" mb={4}>
                  <img
                    src="/logo.jpeg"
                    width="100%"
                    style={{ objectFit: "contain" }}
                    alt="logo"
                  />
                </Box>
                <Box paddingLeft="16px" textAlign="center">
                  <Typography variant="h4">LJNM Shikharji Yatra</Typography>
                  <Typography margin="8px 0">Passenger details form</Typography>
                </Box>
              </Box>
              {loadingUserInfo ? (
                <Box
                  display="flex"
                  alignItems="center"
                  flexDirection="column"
                  paddingTop="32px"
                >
                  <Skeleton
                    sx={{ bgcolor: "#853a4bad", marginBottom: "16px" }}
                    variant="rectangular"
                    width="80%"
                    height="40px"
                  />
                  <Skeleton
                    sx={{ bgcolor: "#853a4bad", marginBottom: "32px" }}
                    variant="rectangular"
                    width="80%"
                    height="40px"
                  />
                  <Skeleton
                    sx={{ bgcolor: "#853a4bad" }}
                    variant="rectangular"
                    width="200px"
                    height="40px"
                  />
                </Box>
              ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  marginTop="40px"
                >
                  <TextField
                    fullWidth
                    label="Enter Hoti Number"
                    color="secondary"
                    value={hotiNumber > 0 ? hotiNumber : ""}
                    sx={{
                      color: "fff",
                      input: { color: "white" },
                      marginBottom: "16px",
                      width: "80%",
                    }}
                    focused
                    onKeyUp={handleSubmit}
                    error={
                      hotiNumber === 0 ||
                      hotiNumber > 225 ||
                      errorField === "hotiNumber"
                    }
                    onChange={updateHotiDetails}
                    type="number"
                    helperText={
                      hotiNumber === 0 ||
                      hotiNumber > 225 ||
                      errorField === "hotiNumber"
                        ? "Please enter Hoti number between 1 and 224"
                        : " "
                    }
                  />
                  <TextField
                    fullWidth
                    focused
                    label="Mobile Number"
                    sx={{
                      width: "80%",
                      color: "fff",
                      input: { color: "white" },
                    }}
                    color="secondary"
                    type="phone"
                    name="mobile"
                    onKeyUp={handleSubmit}
                    onChange={updatePhoneNumber}
                    required
                    value={mobile || ""}
                    variant="outlined"
                    error={
                      isMobileInvalidNumber(mobile) || errorField === "mobile"
                    }
                    helperText={
                      isMobileInvalidNumber(mobile)
                        ? "Mobile number should be 10 digits"
                        : errorField === "mobile"
                        ? "Please enter mobile number"
                        : " "
                    }
                  />

                  <Typography
                    paddingX="12px"
                    fontSize="14px"
                    textAlign="center"
                  >
                    {errorField === "noData" ? (
                      <>
                        No data found for hoti {hotiNumber} and mobile {mobile}.
                        Please check the number and try again.
                      </>
                    ) : errorField === "authError" ? (
                      <>{phoneNumberErrorMessage}</>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </Typography>
                  <IconButton
                    color="secondary"
                    disabled={showLoader}
                    onClick={getHotiDetails}
                    sx={{ marginLeft: "16px" }}
                    id="sign-in-button"
                  >
                    <>
                      <Typography sx={{ color: "inherit" }} fontSize="20px">
                        Go
                      </Typography>
                      {!showLoader ? (
                        <ArrowForwardIos></ArrowForwardIos>
                      ) : (
                        <CircularProgress size={20} color="secondary" />
                      )}
                    </>
                  </IconButton>
                </Box>
              )}
            </Grid>
          </Grid>
          <Modal
            open={showModal}
            // onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableEnforceFocus
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              padding="24px"
              sx={{
                position: "absolute" as "absolute",
                left: "2%",
                right: "2%",
                top: "40%",
                transform: "translateY(-50%)",
                boxShadow: 24,

                bgcolor: "#341219",
                borderRadius: "12px",
                "@media (min-width:480px)": {
                  left: "50%",
                  right: "auto",
                  top: "20%",
                  transform: "translateX(-50%)",
                  maxWidth: "500px",
                },
              }}
            >
              <Typography marginBottom="16px">
                Enter OTP received on{" "}
                <span style={{ color: LJNMColors.secondary }}> {mobile}</span>
              </Typography>

              <TextField
                sx={{
                  color: "fff",
                  input: { color: "white" },
                }}
                autoFocus
                color="secondary"
                onChange={handleOTPChange}
                value={otpNumber}
                label="OTP"
              />
              <Typography>
                {errorField === "authError" ? (
                  <>{phoneNumberErrorMessage}</>
                ) : (
                  <>&nbsp;</>
                )}
              </Typography>

              <Button
                disabled={otpNumber.length < 6 || validatingOTP}
                sx={{
                  marginTop: "16px",
                  "&.Mui-disabled": { color: "#ffffff87" },
                }}
                color="secondary"
                onClick={validateOTP}
              >
                Submit
                {validatingOTP ? (
                  <CircularProgress size={20} color="secondary" />
                ) : (
                  <ArrowForwardIos></ArrowForwardIos>
                )}
              </Button>
            </Box>
          </Modal>
        </Box>
      ) : (
        <HotiDetailsPage
          setYatriDetails={setYatriDetails}
          clearHotiDetails={clearHotiDetails}
          hotiDetails={hotiDetails}
          yatriDetails={yatriDetails}
          hotiAllocationDetails={hotiAllocationDetails}
        />
      )}
    </>
  );
};
export default HomeComponent;
async function loadHotiDetailsByMobileNumber(
  user: User,
  setHotiDetails: React.Dispatch<React.SetStateAction<Hoti>>
) {
  if (user.phoneNumber) {
    const hotiData = await getHotiDetailById(
      user.phoneNumber.substring(3),
      -1,
      true
    );
    if (hotiData.hotiId) {
      setHotiDetails(hotiData);
    }
  }
}
