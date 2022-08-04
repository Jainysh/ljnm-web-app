import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import PhoneNumberInput from "../../components/PhoneNumberInput";
import { getBookingSummary } from "../../firebase/service";
import { BookingSummary } from "../../types/bookingSummary";
import {
  firebaseAuth,
  getInvisibleRecaptchaVerifier,
  getSignInWithPhoneNumber,
} from "../../firebase";
import { getHumanErrorMessage } from "../../lib/helper";
import Modal from "@mui/material/Modal";
import { LJNMColors } from "../../styles";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import { LocalStorageKeys } from "../../components/TicketDetails/constant";
import { Unsubscribe } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import TableCell from "@mui/material/TableCell";
import {
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isValidUser, setIsValidUser] = useState(false);
  const [generatingOTP, setGeneratingOTP] = useState(false);
  const [bookingSummary, setBookingSummary] = useState<BookingSummary[]>([]);
  const [bookingDetailsLastUpdated, setBookingDetailsLastUpdated] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const adminUsers = ["+919049778749", "+919422045027", "+919892849876"];
  const [otpRequestObject, setOtpRequestObject] = useState<any>({});
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [validatingOTP, setValidatingOTP] = useState(false);
  const [otpNumber, setOtpNumber] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    let authUnsubscribe: Unsubscribe;
    const doExecute = async () => {
      if (
        firebaseAuth.currentUser?.phoneNumber &&
        adminUsers.includes(firebaseAuth.currentUser.phoneNumber)
      ) {
        setIsValidUser(true);
        getBookingSummaryDetails();
      } else {
        authUnsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
          if (user) {
            // User is signed in
            if (user.phoneNumber && adminUsers.includes(user.phoneNumber)) {
              setIsValidUser(true);
              getBookingSummaryDetails();
            } else {
              setIsValidUser(false);
              setDataLoaded(true);
              signOut();
            }
          } else {
            setDataLoaded(true);
          }
        });
      }
    };
    doExecute();
    return () => {
      authUnsubscribe && authUnsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateOTP = async (phoneNumber: string) => {
    setPhoneNumberErrorMessage("");
    setGeneratingOTP(true);
    console.log("phoenNumber", phoneNumber);
    const invisibleRecaptchaVerifier = getInvisibleRecaptchaVerifier();
    try {
      const otpRequest = await getSignInWithPhoneNumber(
        `+91${phoneNumber}`,
        invisibleRecaptchaVerifier
      );
      setOtpRequestObject(otpRequest);
      setPhoneNumberErrorMessage("");
      setGeneratingOTP(false);

      setShowModal(true);
    } catch (error: any) {
      const errorMessageToShow = getHumanErrorMessage(error.code);
      // TODO: handle error message
      setGeneratingOTP(false);

      setPhoneNumberErrorMessage(errorMessageToShow);
    }
  };

  const getBookingSummaryDetails = async () => {
    const lastUpdatedTime =
      localStorage.getItem(LocalStorageKeys.bookingDetailsLastUpdated) || "0";
    const today = new Date();
    console.log(
      today.getTime(),
      lastUpdatedTime,
      today.getTime() - parseInt(lastUpdatedTime)
    );
    if (today.getTime() - parseInt(lastUpdatedTime) > 1000 * 60 * 60) {
      console.log("server call");
      const bookingDetails = await getBookingSummary();
      setBookingSummary(bookingDetails);
      localStorage.setItem(
        LocalStorageKeys.bookingSummaryCache,
        JSON.stringify(bookingDetails)
      );
      localStorage.setItem(
        LocalStorageKeys.bookingDetailsLastUpdated,
        today.getTime().toString()
      );
      setBookingDetailsLastUpdated(today.getTime());
      setDataLoaded(true);
    } else {
      console.log("cache call");
      const bookingDetails = JSON.parse(
        localStorage.getItem(LocalStorageKeys.bookingSummaryCache) || "[]"
      );
      setBookingDetailsLastUpdated(parseInt(lastUpdatedTime));
      setBookingSummary(bookingDetails);
      setDataLoaded(true);
    }
  };

  const validateOTP = async () => {
    setValidatingOTP(true);
    try {
      const result = await otpRequestObject.confirm(otpNumber);
      const user = result.user;
      if (user) {
        if (user?.phoneNumber && adminUsers.includes(user.phoneNumber)) {
          setIsValidUser(true);
          await getBookingSummaryDetails();
        } else {
          setPhoneNumberErrorMessage(
            "You do not have admin access. Please contact us at +91-9422045027"
          );
          setIsValidUser(false);
        }
      }
      setValidatingOTP(false);
      setShowModal(false);
      setOtpNumber("");
    } catch (error: any) {
      const errorMessageToShow = getHumanErrorMessage(error.code);
      // TODO: handle error message
      setPhoneNumberErrorMessage(errorMessageToShow);
      setValidatingOTP(false);
      setOtpNumber(""); //not working; TODO: need to fix
    }
  };

  const handleOTPChange = (e: any) => {
    if (e.target.value.length <= 6) {
      setPhoneNumberErrorMessage("");
      setOtpNumber(e.target.value);
    }
  };

  const headCells = [
    {
      id: "hotiId",
      numeric: false,
      disablePadding: true,
      label: "#",
    },
    {
      id: "vacantTickets",
      numeric: true,
      disablePadding: false,
      label: "Vacant seats",
    },

    {
      id: "labhartiTickets",
      numeric: false,
      disablePadding: true,
      label: "Labharti Tickets",
    },
    {
      id: "hotiTickets",
      numeric: false,
      disablePadding: true,
      label: "Hoti Tickets",
    },
    {
      id: "extraTickets",
      numeric: false,
      disablePadding: true,
      label: "Extra Tickets",
    },
    {
      id: "childTickets",
      numeric: false,
      disablePadding: true,
      label: "Child Tickets",
    },
    {
      id: "totalTickets",
      numeric: false,
      disablePadding: true,
      label: "Total Tickets",
    },
  ];

  const getTotalSubmittedTickets = (bookingSummary: BookingSummary) =>
    bookingSummary.hotiTicketYatri.length +
    bookingSummary.extraTicketYatri.length +
    bookingSummary.labhartiTicketYatri.length;

  const signOut = async () => {
    firebaseAuth.signOut();
    setIsValidUser(false);
  };

  return (
    <Box padding="20px">
      {dataLoaded && isValidUser ? (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography>Booking Summary</Typography>
              <Typography fontSize="14px" fontStyle="italic" marginBottom="8px">
                Last updated on this device at&nbsp;
                {new Date(bookingDetailsLastUpdated).toLocaleTimeString()}
              </Typography>
            </Box>
            <Box display="flex">
              <Button
                onClick={() => {
                  navigate("/");
                }}
                variant="outlined"
                sx={{ marginRight: "8px" }}
                color="secondary"
              >
                <HomeIcon />
              </Button>

              <Button onClick={signOut} variant="outlined" color="secondary">
                <PowerSettingsNewIcon />
              </Button>
            </Box>
          </Box>
          <TableContainer>
            <Table
              bgcolor="white"
              // sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="small"
            >
              <TableHead>
                <TableRow>
                  {headCells.map((headCell) => (
                    <TableCell align="center" key={headCell.id}>
                      <TableSortLabel>{headCell.label}</TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {bookingSummary
                  .sort((a, b) => a.hotiId - b.hotiId)
                  .map((bookingSummaryRow) => (
                    <TableRow key={bookingSummaryRow.hotiId}>
                      <TableCell
                        component="th"
                        id={bookingSummaryRow.hotiId.toString()}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {bookingSummaryRow.hotiId}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={bookingSummaryRow.hotiId.toString()}
                        scope="row"
                        padding="none"
                        align="right"
                      >
                        {bookingSummaryRow.hotiTicketQuota +
                          bookingSummaryRow.extraTicketQuota +
                          bookingSummaryRow.labhartiTicketQuota -
                          getTotalSubmittedTickets(bookingSummaryRow)}
                      </TableCell>

                      <TableCell
                        component="th"
                        id={bookingSummaryRow.hotiId.toString()}
                        scope="row"
                        padding="none"
                        align="right"
                      >
                        {bookingSummaryRow.labhartiTicketYatri.length}/
                        {bookingSummaryRow.labhartiTicketQuota}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={bookingSummaryRow.hotiId.toString()}
                        scope="row"
                        padding="none"
                        align="right"
                      >
                        {bookingSummaryRow.hotiTicketYatri.length}/
                        {bookingSummaryRow.hotiTicketQuota}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={bookingSummaryRow.hotiId.toString()}
                        scope="row"
                        padding="none"
                        align="right"
                      >
                        {bookingSummaryRow.extraTicketYatri.length}/
                        {bookingSummaryRow.extraTicketQuota}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={bookingSummaryRow.hotiId.toString()}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {bookingSummaryRow.childTicketYatri.length}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={bookingSummaryRow.hotiId.toString()}
                        scope="row"
                        padding="none"
                        align="right"
                      >
                        {getTotalSubmittedTickets(bookingSummaryRow)} /
                        {bookingSummaryRow.hotiTicketQuota +
                          bookingSummaryRow.extraTicketQuota +
                          bookingSummaryRow.labhartiTicketQuota}
                        &nbsp; + &nbsp;
                        {bookingSummaryRow.childTicketYatri.length}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Grid>
          <Grid item xs={12} sm={6} lg={6}>
            <Box bgcolor="white" padding="16px">
              <Typography
                fontSize="24px"
                color="#303030"
                paddingBottom="16px"
                textAlign="center"
              >
                Admin Login
              </Typography>
              {dataLoaded ? (
                <>
                  <PhoneNumberInput
                    onPhoneNumberSubmit={generateOTP}
                    showLoader={generatingOTP}
                  />
                  {phoneNumberErrorMessage ? (
                    <Typography
                      color="#303030"
                      textAlign="center"
                      marginY="24px"
                    >
                      {phoneNumberErrorMessage}
                    </Typography>
                  ) : (
                    <>&nbsp;</>
                  )}{" "}
                </>
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  flexDirection="column"
                  paddingTop="32px"
                >
                  <Skeleton
                    sx={{ marginBottom: "16px" }}
                    variant="rectangular"
                    width="80%"
                    height="40px"
                  />
                  <Skeleton variant="rectangular" width="200px" height="40px" />
                </Box>
              )}

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
                      Enter 6 digit OTP received{" "}
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
                      <>{phoneNumberErrorMessage || <>&nbsp;</>}</>
                    </Typography>

                    <Button
                      sx={{
                        marginTop: "16px",
                        marginRight: "16px",
                        // "&.Mui-disabled": { color: "#ffffff87" },
                      }}
                      variant="outlined"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </Button>

                    <Button
                      disabled={otpNumber.length < 6 || validatingOTP}
                      sx={{
                        marginTop: "16px",
                        // "&.Mui-disabled": { color: "#ffffff87" },
                      }}
                      variant="contained"
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
                </Box>
              </Modal>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
export default AdminPage;
