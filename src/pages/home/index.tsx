import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  getHotiDetailById,
  getAllYatriDetailsById,
  getHotiDetailsByMobileNumber,
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
import { getHumanErrorMessage } from "../../lib/helper";
import { onAuthStateChanged, User } from "firebase/auth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { isHotiInvalid } from "../../components/TicketDetails";
import InfoBanner from "../../components/InfoBanner";

const HomeComponent = () => {
  const [hotiNumber, setHotiNumber] = useState(-1);
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
  const [isVerified, setIsVerified] = useState(false);

  const [otpNumber, setOtpNumber] = useState("");
  const [validatingOTP, setValidatingOTP] = useState(false);

  const [OTPState, setOTPState] = useState<
    "NOT_SENT" | "SENDING" | "SENT" | "ERROR"
  >("NOT_SENT");

  const getHotiDetails = async () => {
    if (firebaseAuth.currentUser) {
      console.log("user", firebaseAuth.currentUser);
      return;
    }
    if (isHotiInvalid(hotiNumber) || hotiNumber < 0) {
      setErrorField("hotiNumber");
      return;
    }
    // console.log(mobile, isMobileInvalidNumber(mobile));
    // if (!mobile || isMobileInvalidNumber(mobile)) {
    //   setErrorField("mobile");
    //   return;
    // }
    setShowLoader(true);

    const hotiDetails = await getHotiDetailById(hotiNumber);
    if (hotiDetails.hotiId) {
      setHotiDetails(hotiDetails);
      setShowModal(true);
      // setHotiDetails(hotiDetails);
    } else {
      setErrorField("noData");
    }
    setShowLoader(false);
  };

  const sendOTP = async () => {
    setOTPState("SENDING");
    const invisibleRecaptchaVerifier = getInvisibleRecaptchaVerifier();
    try {
      const otpRequest = await getSignInWithPhoneNumber(
        `+91${hotiDetails.mobile}`,
        invisibleRecaptchaVerifier
      );
      setOTPState("SENT");
      setOtpRequestObject(otpRequest);
      setPhoneNumberErrorMessage("");
      setShowModal(true);
    } catch (error: any) {
      setOTPState("ERROR");
      const errorMessageToShow = getHumanErrorMessage(error.code);
      // TODO: handle error message
      setPhoneNumberErrorMessage(errorMessageToShow);
      setErrorField("authError");
    }
  };

  const validateOTP = async () => {
    setValidatingOTP(true);
    try {
      const result = await otpRequestObject.confirm(otpNumber);
      const user = result.user;
      if (user) {
        await loadHotiDetailsByMobileNumber(user);
      }
      setValidatingOTP(false);
      setShowModal(false);
      setOtpNumber("");
    } catch (error: any) {
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
    setIsVerified(false);
    setOTPState("NOT_SENT");
  };

  const updateHotiDetails = (e: any) => {
    const hotiNumber = e.target.value;
    if (isHotiInvalid(hotiNumber) || hotiNumber < 0) {
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

  useEffect(() => {
    let authUnsubscribe: Unsubscribe;
    const doExecute = async () => {
      if (firebaseAuth.currentUser?.phoneNumber) {
        await loadHotiDetailsByMobileNumber(firebaseAuth.currentUser);
        setLoadingUserInfo(false);
      } else {
        authUnsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
          if (user) {
            // User is signed in
            if (user.phoneNumber) {
              await loadHotiDetailsByMobileNumber(user);
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

  async function loadHotiDetailsByMobileNumber(user: User) {
    if (user.phoneNumber) {
      const hotiData = await getHotiDetailsByMobileNumber(
        user.phoneNumber.substring(3)
      );
      if (hotiData.hotiId) {
        setHotiDetails(hotiData);
        setIsVerified(true);
      }
    }
  }

  return (
    <>
      {!isVerified || !hotiDetails.name ? (
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
                  <InfoBanner />
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
                      isHotiInvalid(hotiNumber) || errorField === "hotiNumber"
                    }
                    onChange={updateHotiDetails}
                    type="number"
                    helperText={
                      isHotiInvalid(hotiNumber) || errorField === "hotiNumber"
                        ? "Please enter a valid Hoti Number"
                        : " "
                    }
                  />

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
            open={showModal && !!hotiDetails.name}
            // onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableEnforceFocus
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              padding="16px"
              sx={{
                position: "absolute" as "absolute",
                left: "2%",
                right: "2%",
                top: "40%",
                transform: "translateY(-50%)",
                boxShadow: 50,
                bgcolor: "white",
                color: LJNMColors.primary,
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
              {hotiDetails.name &&
              (OTPState === "NOT_SENT" || OTPState === "SENDING") ? (
                <Box>
                  <Box
                    border="1px solid #ea8da1a8"
                    padding="16px"
                    borderRadius="8px"
                  >
                    <Typography color={LJNMColors.primary} fontWeight={700}>
                      Hoti Details
                    </Typography>
                    <Typography
                      marginTop="12px"
                      marginBottom="1px"
                      color={LJNMColors.primary}
                      textTransform="capitalize"
                    >
                      {hotiDetails.name.toLocaleLowerCase()} Family
                    </Typography>
                    <Typography
                      color={LJNMColors.primary}
                      sx={{
                        textTransform: "capitalize",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <LocationOnIcon
                        sx={{ marginRight: "2px" }}
                        fontSize="small"
                      />
                      {hotiDetails.city.toLocaleLowerCase()}
                    </Typography>
                    <Typography
                      fontSize="15px"
                      marginY="24px"
                      textAlign="center"
                      color={LJNMColors.primary}
                    >
                      An OTP will be sent to{" "}
                      <strong>{hotiDetails.mobile}</strong> to proceed with
                      yatri details.
                    </Typography>
                    <Typography color={LJNMColors.primary}>
                      {errorField === "authError" ? (
                        <>{phoneNumberErrorMessage}</>
                      ) : (
                        <>&nbsp;</>
                      )}
                    </Typography>

                    <Box display="flex" justifyContent="center">
                      <Button
                        variant="outlined"
                        onClick={() => setShowModal(false)}
                        sx={{ marginRight: "8px" }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        disabled={OTPState === "SENDING"}
                        onClick={sendOTP}
                      >
                        Send OTP &nbsp;
                        {OTPState === "SENDING" ? (
                          <CircularProgress size={18} />
                        ) : (
                          <ArrowForwardIos
                            sx={{ fontSize: "14px" }}
                          ></ArrowForwardIos>
                        )}
                      </Button>
                    </Box>
                  </Box>
                  <Typography
                    border="1px solid #ea8da1a8"
                    textAlign="center"
                    padding="8px"
                    borderRadius="8px"
                    marginTop="24px"
                    color={LJNMColors.primary}
                    fontSize="14px"
                  >
                    If you wish to change the mobile number for this Hoti,
                    please contact us at
                    <a
                      style={{
                        textDecoration: "none",
                        fontWeight: 600,
                        color: LJNMColors.primary,
                      }}
                      href="tel:+919422045027"
                    >
                      {" "}
                      +91-9422045027
                    </a>
                  </Typography>
                </Box>
              ) : OTPState === "SENT" ? (
                <Box
                  border="1px solid #ea8da1a8"
                  textAlign="center"
                  padding="16px"
                  borderRadius="8px"
                  color={LJNMColors.primary}
                  fontSize="14px"
                >
                  <Typography
                    color={LJNMColors.primary}
                    textAlign="center"
                    marginBottom="16px"
                  >
                    Enter 6 digit OTP received on {hotiDetails.mobile}
                  </Typography>

                  <TextField
                    sx={{
                      color: "fff",
                      marginTop: "16px",
                    }}
                    autoFocus
                    color="secondary"
                    onChange={handleOTPChange}
                    value={otpNumber}
                    label="OTP"
                    type="tel"
                  />
                  <Typography color={LJNMColors.primary}>
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
                      // "&.Mui-disabled": { color: "#ffffff87" },
                    }}
                    variant="outlined"
                    onClick={validateOTP}
                  >
                    Submit &nbsp;
                    {validatingOTP ? (
                      <CircularProgress size={16} />
                    ) : (
                      <ArrowForwardIos
                        sx={{ fontSize: "14px" }}
                      ></ArrowForwardIos>
                    )}
                  </Button>
                </Box>
              ) : OTPState === "ERROR" && errorField === "authError" ? (
                <>
                  {phoneNumberErrorMessage}
                  <Button
                    variant="outlined"
                    sx={{ marginTop: "16px" }}
                    onClick={() => {
                      setOTPState("NOT_SENT");
                      setErrorField("");
                      setShowModal(false);
                    }}
                  >
                    Close
                  </Button>
                </>
              ) : (
                <>&nbsp;</>
              )}
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
