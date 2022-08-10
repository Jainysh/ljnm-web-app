import Box from "@mui/material/Box";
import React, { useEffect, useMemo, useState } from "react";
import PhoneNumberInput from "../../components/PhoneNumberInput";
import { getBookingSummary, getHotiDetailById } from "../../firebase/service";
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
} from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { Hoti } from "../../types/hoti";
import * as excel from "exceljs";
import { TicketType, YatriDetails } from "../../types/yatriDetails";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
const AdminPage = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isValidUser, setIsValidUser] = useState(false);
  const [generatingOTP, setGeneratingOTP] = useState(false);
  const [bookingSummary, setBookingSummary] = useState<BookingSummary[]>([]);
  const [bookingDetailsLastUpdated, setBookingDetailsLastUpdated] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const adminUsers = [
    "+919049778749",
    "+919422045027",
    "+919892849876",
    "+919999988888",
  ];
  const [otpRequestObject, setOtpRequestObject] = useState<any>({});
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [validatingOTP, setValidatingOTP] = useState(false);
  const [otpNumber, setOtpNumber] = useState("");
  let navigate = useNavigate();

  type excelData = {
    hotiId: number;
    // name: string;
    // city: string;
    // mobile: string;
    yatriId: string;
    dateOfBirth: string;
    fullName: string;
    gender: string;
    idProof: string;
    yatriMobile: string;
    ticketType: string;
  };
  const exportToExcel = () => {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");
    worksheet.columns = [
      { header: "Hoti Id", key: "hotiId", width: 10 },
      // { header: "Hoti Mobile Number", key: "name"},
      // { header: "City", key: "city"},
      // { header: "Mobile", key: "mobile"},
      { header: "Yatri Id", key: "yatriId", width: 15 },
      { header: "Date Of Birth", key: "dateOfBirth", width: 30 },
      { header: "Full Name", key: "fullName", width: 30 },
      { header: "Gender", key: "gender", width: 15 },
      { header: "Id Proof", key: "idProof", width: 30 },
      { header: "Yatri Mobile", key: "yatriMobile", width: 30 },
      { header: "Ticket Type", key: "ticketType", width: 15 },
    ];
    const data: excelData[] = [];
    bookingSummary
      .sort((a, b) => a.hotiId - b.hotiId)
      .forEach((booking) => {
        const extraYatris: excelData[] = booking.extraTicketYatri.map(
          mapToExcelData()
        );
        const labhartiYatris: excelData[] = booking.labhartiTicketYatri.map(
          mapToExcelData()
        );
        const hotiYatris: excelData[] = booking.hotiTicketYatri.map(
          mapToExcelData()
        );

        const childYatris: excelData[] = booking.childTicketYatri.map(
          mapToExcelData()
        );
        data.push(
          ...labhartiYatris,
          ...hotiYatris,
          ...extraYatris,
          ...childYatris
        );

        function mapToExcelData(): (
          value: YatriDetails,
          index: number,
          array: YatriDetails[]
        ) => {
          hotiId: number;
          // name: booking.hotiName,
          // city: booking.hotiCity,
          // mobile: booking.hotiMobile,
          yatriId: string;
          dateOfBirth: any;
          fullName: string;
          gender: "Male" | "Female";
          idProof: string;
          yatriMobile: string;
          ticketType: TicketType;
        } {
          return (extraYatri) => {
            return {
              hotiId: booking.hotiId,
              // name: booking.hotiName,
              // city: booking.hotiCity,
              // mobile: booking.hotiMobile,
              yatriId: extraYatri.yatriId,
              dateOfBirth: extraYatri.dateOfBirth.split("T")[0],
              fullName: extraYatri.fullName,
              gender: extraYatri.gender,
              idProof: extraYatri.idProof,
              yatriMobile: extraYatri.mobile,
              ticketType: extraYatri.ticketType,
            };
          };
        }
      });
    worksheet.addRows(data);
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `LJNMConfirmedPassengers${new Date().toISOString()}.xlsx`;
      link.click();
    });
  };

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
      label: "Vacant",
    },
    {
      id: "totalTickets",
      numeric: false,
      disablePadding: true,
      label: "Filled",
    },
    {
      id: "labhartiTickets",
      numeric: false,
      disablePadding: true,
      label: "Labharti",
    },
    {
      id: "hotiTickets",
      numeric: false,
      disablePadding: true,
      label: "Hoti",
    },
    {
      id: "extraTickets",
      numeric: false,
      disablePadding: true,
      label: "Extra",
    },
    {
      id: "childTickets",
      numeric: false,
      disablePadding: true,
      label: "Child",
    },
  ];

  const getTotalSubmittedTicketsPerHoti = (bookingSummary: BookingSummary) =>
    bookingSummary.hotiTicketYatri.length +
    bookingSummary.extraTicketYatri.length +
    bookingSummary.labhartiTicketYatri.length;

  const getTotalVacantTicketsPerHoti = (bookingSummary: BookingSummary) =>
    bookingSummary.hotiTicketQuota +
    bookingSummary.extraTicketQuota +
    bookingSummary.labhartiTicketQuota -
    getTotalSubmittedTicketsPerHoti(bookingSummary);

  const getTotalSubmittedTickets = (bookingList: BookingSummary[]) =>
    bookingList.reduce(
      (acc, curr) => acc + getTotalSubmittedTicketsPerHoti(curr),
      0
    );

  const getTotalVacantTickets = (bookingList: BookingSummary[]) =>
    bookingList.reduce(
      (acc, curr) => acc + getTotalVacantTicketsPerHoti(curr),
      0
    );

  const totalVacantTickets = useMemo(
    () => getTotalVacantTickets(bookingSummary),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bookingSummary]
  );
  const signOut = async () => {
    firebaseAuth.signOut();
    setIsValidUser(false);
  };

  const [selectedHotiAllocation, setSelectedHotiAllocation] =
    useState<BookingSummary>();

  const [selectedHoti, setSelectedHoti] = useState<Hoti>();

  const handleClick = async (
    event: React.MouseEvent<unknown>,
    bookingSummary: BookingSummary
  ) => {
    console.log(bookingSummary);
    setSelectedHotiAllocation(bookingSummary);
    setShowModal(true);
    const hoti = await getHotiDetailById(bookingSummary.hotiId);
    console.log(hoti);
    setSelectedHoti(hoti);
    // const selectedIndex = selected.indexOf(name);
    // let newSelected: readonly string[] = [];

    // if (selectedIndex === -1) {
    //   newSelected = newSelected.concat(selected, name);
    // } else if (selectedIndex === 0) {
    //   newSelected = newSelected.concat(selected.slice(1));
    // } else if (selectedIndex === selected.length - 1) {
    //   newSelected = newSelected.concat(selected.slice(0, -1));
    // } else if (selectedIndex > 0) {
    //   newSelected = newSelected.concat(
    //     selected.slice(0, selectedIndex),
    //     selected.slice(selectedIndex + 1),
    //   );
  };

  return (
    <Box padding="20px">
      {dataLoaded && isValidUser ? (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`1px solid ${LJNMColors.secondary}`}
            paddingBottom="8px"
          >
            <Box>
              <Typography>Booking Summary</Typography>
            </Box>
            <Box display="flex">
              <Button
                variant="outlined"
                sx={{ marginRight: "8px" }}
                color="secondary"
                onClick={exportToExcel}
              >
                <FileDownloadIcon />
              </Button>
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
          <Box marginY="8px">
            <Typography fontSize="14px" fontStyle="italic" marginBottom="8px">
              Last updated on this device at&nbsp;
              {new Date(bookingDetailsLastUpdated).toLocaleTimeString()}
            </Typography>
            <Typography>
              Total Submitted Tickets:{" "}
              {getTotalSubmittedTickets(bookingSummary)}
            </Typography>
            <Typography>Total Vacant Tickets: {totalVacantTickets}</Typography>
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
                      {/* <TableSortLabel>{headCell.label}</TableSortLabel> */}
                      <strong>{headCell.label}</strong>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {bookingSummary
                  .sort(
                    (a, b) =>
                      getTotalVacantTicketsPerHoti(b) -
                      getTotalVacantTicketsPerHoti(a)
                  )
                  .map((bookingSummaryRow) => (
                    <TableRow
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "#e8dbde",
                        },
                        // hide last border
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                      onClick={(e) => handleClick(e, bookingSummaryRow)}
                      key={bookingSummaryRow.hotiId}
                    >
                      <TableCell
                        component="th"
                        id={bookingSummaryRow.hotiId.toString()}
                        scope="row"
                        padding="normal"
                        align="center"
                      >
                        {bookingSummaryRow.hotiId}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={bookingSummaryRow.hotiId.toString()}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {getTotalVacantTicketsPerHoti(bookingSummaryRow)}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={bookingSummaryRow.hotiId.toString()}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {getTotalSubmittedTicketsPerHoti(bookingSummaryRow)}
                        {bookingSummaryRow.childTicketYatri.length
                          ? ` + ${bookingSummaryRow.childTicketYatri.length}`
                          : ""}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={bookingSummaryRow.hotiId.toString()}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {bookingSummaryRow.labhartiTicketYatri.length}/
                        {bookingSummaryRow.labhartiTicketQuota}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={bookingSummaryRow.hotiId.toString()}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {bookingSummaryRow.hotiTicketYatri.length}/
                        {bookingSummaryRow.hotiTicketQuota}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={bookingSummaryRow.hotiId.toString()}
                        scope="row"
                        padding="none"
                        align="center"
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
            </Box>
          </Grid>
        </Grid>
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
          {selectedHotiAllocation?.hotiId ? (
            <Box border="1px solid #ea8da1a8" padding="16px" borderRadius="8px">
              <Typography color={LJNMColors.primary} fontWeight={700}>
                Hoti Details
              </Typography>
              {selectedHoti?.hotiId ? (
                <>
                  <Typography
                    marginTop="12px"
                    marginBottom="1px"
                    color={LJNMColors.primary}
                    textTransform="capitalize"
                  >
                    {selectedHoti.name.toLocaleLowerCase()},{" "}
                    {selectedHoti.city.toLocaleLowerCase()}
                  </Typography>
                  <Typography
                    marginTop="8px"
                    textAlign="center"
                    fontWeight="700"
                    color={LJNMColors.primary}
                  >
                    Total Submitted Tickets:{" "}
                    {getTotalSubmittedTicketsPerHoti(selectedHotiAllocation)}
                  </Typography>
                  <Typography
                    marginBottom="8px"
                    textAlign="center"
                    fontWeight="700"
                    color={LJNMColors.primary}
                  >
                    Total Vacant Tickets:{" "}
                    {getTotalVacantTicketsPerHoti(selectedHotiAllocation)}
                  </Typography>
                  {/* <Typography color={LJNMColors.primary}>
                    {selectedHotiAllocation.hotiTicketYatri.length} /{" "}
                    {selectedHotiAllocation.hotiTicketQuota}&nbsp; Hoti Tickets
                  </Typography>
                  <Typography color={LJNMColors.primary}>
                    {selectedHotiAllocation.labhartiTicketYatri.length} /{" "}
                    {selectedHotiAllocation.labhartiTicketQuota}&nbsp; Labharti
                    Tickets
                  </Typography>
                  <Typography color={LJNMColors.primary}>
                    {selectedHotiAllocation.extraTicketYatri.length} /{" "}
                    {selectedHotiAllocation.extraTicketQuota}&nbsp; Extra
                    Tickets
                  </Typography> */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    marginTop="24px"
                  >
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSelectedHotiAllocation(undefined);
                        setSelectedHoti(undefined);
                        setShowModal(false);
                      }}
                      sx={{ marginRight: "8px" }}
                    >
                      Close
                    </Button>

                    <a
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        whiteSpace: "nowrap",
                      }}
                      href={`tel:+91${selectedHoti.mobile}`}
                    >
                      <Button variant="contained">
                        Call&nbsp;
                        <strong>{selectedHoti.mobile}</strong>
                      </Button>
                    </a>
                  </Box>
                </>
              ) : (
                <>
                  <Skeleton
                    sx={{ marginY: "24px" }}
                    variant="rectangular"
                    width="100px"
                    height="24px"
                  />
                  <Skeleton
                    sx={{ marginBottom: "12px" }}
                    variant="rectangular"
                    width="100px"
                    height="24px"
                  />
                  <Skeleton variant="rectangular" width="80px" height="20px" />
                </>
              )}
            </Box>
          ) : (
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
                  <ArrowForwardIos sx={{ fontSize: "14px" }}></ArrowForwardIos>
                )}
              </Button>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};
export default AdminPage;
