import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import CardHeader from "@mui/material/CardHeader";
// import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
// import Snackbar from "@mui/material/Snackbar";
// import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { HotiAllocationDetail } from "../../types/hotiAllocationDetail";
// import // addPassengerDetails,
// // deleteYatriById,
// // editYatriById,
// // updateProfilePicService,
// "../../firebase/service";
import { TicketType, YatriDetails } from "../../types/yatriDetails";
// import { FormFields } from "./constant";
// import MuiAlert, { AlertColor } from "@mui/material/Alert";
import YatriDetailView from "../YatriDetailView";
import { ArrowBackIos } from "@mui/icons-material";
// import { convertToAge } from "../../lib/helper";
import Typography from "@mui/material/Typography";
// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";
// import FormHelperText from "@mui/material/FormHelperText";
// import { LJNMColors } from "../../styles";
// import Backdrop from "@mui/material/Backdrop";
// import CircularProgress from "@mui/material/CircularProgress";
// import Modal from "@mui/material/Modal";
// import ImageDisplayContainer from "../ImageDisplay";
// import { firebaseAuth } from "../../firebase";

// type YatriFormFieldType = YatriDetails & {
//   isDirty: boolean;
//   [key: string]: any;
// };

type AddViewTicketDetailsProps = {
  hotiAllocationDetails: HotiAllocationDetail;
  yatriDetails: YatriDetails[];
  ticketType: TicketType;
  setIsDataConfirmed: (data: boolean) => void;
  setYatriDetails: (data: YatriDetails[]) => void;
};

const AddViewTicketDetails = ({
  hotiAllocationDetails,
  ticketType,
  setIsDataConfirmed,
  yatriDetails,
}: // setYatriDetails,
AddViewTicketDetailsProps) => {
  // const selectedTab: TicketType = ticketType;
  // const [toastMessage, setToastMessage] = useState("");
  // const [toastSeverity, setToastSeverity] = useState<AlertColor>("info");
  // const [selectedYatri, setSelectedYatri] = useState<YatriFormFieldType>({
  //   isDirty: false,
  // } as YatriFormFieldType);
  // const [toastOpen, setToastOpen] = useState(false);
  // const [showLoader, setShowLoader] = useState(false);
  // const [loaderText, setLoaderText] = useState("");
  // const [showModal, setShowModal] = useState(false);
  // const [selectedYatriForModification, setSelectedYatriForModification] =
  //   useState<YatriDetails>({} as YatriDetails);
  // const handleChange = (e: any) => {
  //   const selectedYatriLocal = selectedYatri;
  //   selectedYatriLocal[e.target.name as string] = e.target.value;
  //   selectedYatriLocal.isDirty = true;
  //   if (e.target.name === "idProof" && e.target.value.length > 12) {
  //     selectedYatriLocal.idProof = (e.target.value as string).slice(0, 12);
  //   }
  //   if (e.target.name === "mobile" && e.target.value.length > 10) {
  //     selectedYatriLocal.mobile = (e.target.value as string).slice(0, 10);
  //   }
  //   setErrorField("");
  //   setSelectedYatri({ ...selectedYatriLocal });
  // };

  // const [currentUser] = useState(firebaseAuth.currentUser?.phoneNumber);

  // const [fileData, setFileData] = useState(null);
  // const [imageURL, setImageURL] = useState("");
  // const [isEditting, setIsEditting] = useState(false);
  // const [isUpdatingProfilePic, setIsUpdatingProfilePic] = useState(false);
  // const uploadFile = (e: any) => {
  //   const fileSize = e.target.files[0].size / 1024;
  //   if (fileSize <= 1024) {
  //     setFileData(e.target.files[0] || null);
  //     const image = URL.createObjectURL(e.target.files[0]);
  //     setImageURL(image);
  //     setErrorField("");
  //   } else {
  //     setErrorField("profilePicture");
  //     setToastMessage(
  //       `File is ${(fileSize / 1024).toFixed(
  //         2
  //       )} MB. File size should be less than 1MB`
  //     );
  //     setToastSeverity("error");
  //     setToastOpen(true);
  //     closeToast();
  //   }
  // };

  // const clearFormFields = () => {
  //   setErrorField("");
  //   setFileData(null);
  //   setImageURL("");
  //   setSelectedYatri({
  //     isDirty: false,
  //   } as YatriFormFieldType);
  //   if (isEditting) {
  //     setShowForm(false);
  //     setIsEditting(false);
  //   }
  // };

  const [yatriList, setYatriList] = useState<YatriDetails[]>(
    yatriDetails.filter((yatri) => yatri.ticketType === ticketType)
  );

  useEffect(() => {
    setYatriList(
      yatriDetails.filter((yatri) => yatri.ticketType === ticketType)
    );
  }, [yatriDetails, ticketType]);

  // const [errorField, setErrorField] = useState<string>();

  // const formEl = useRef<HTMLDivElement>(null);

  // const updateProfilePic = async () => {
  //   if (isUpdatingProfilePic && !fileData) {
  //     setToastMessage("Please upload a photo");
  //     setToastSeverity("error");
  //     setToastOpen(true);
  //     closeToast();
  //     setErrorField("profilePicture");
  //     return;
  //   }
  //   setShowLoader(true);
  //   setLoaderText("Updating profile picture...");
  //   await updateProfilePicService(selectedYatri, fileData);
  //   setIsEditting(false);
  //   clearFormFields();
  //   setShowLoader(false);
  //   setToastMessage(
  //     selectedYatri.ticketType === "CHILD" && ticketType !== "CHILD"
  //       ? "Yatri added as child successfully, Please check added details in Children ticket section"
  //       : "Yatri details added successfully"
  //   );
  //   setToastSeverity("success");
  //   setToastOpen(true);
  //   setShowForm(false);
  //   closeToast();
  // };

  // const addYatriDetails = async (addMore = false) => {
  //   if (!selectedYatri.isDirty) {
  //     setToastMessage("Please fill all the fields");
  //     setToastSeverity("error");
  //     setToastOpen(true);
  //     closeToast();
  //     return;
  //   }
  //   if (!isFormValid(selectedYatri)) {
  //     return;
  //   }

  //   if (convertToAge(selectedYatri.dateOfBirth) <= 5) {
  //     selectedYatri.ticketType = "CHILD";
  //   } else {
  //     selectedYatri.ticketType = selectedTab;
  //   }
  //   setShowLoader(true);
  //   setLoaderText("Adding Yatri Details...");
  //   if (isEditting) {
  //     const updatedYatri = await editYatriById(selectedYatri);
  //     if (updatedYatri) {
  //       setYatriList([
  //         ...yatriList.filter(
  //           (yatri) => yatri.yatriId !== updatedYatri.yatriId
  //         ),
  //         updatedYatri,
  //       ]);
  //     }
  //     setIsEditting(false);
  //   } else {
  //     await addPassengerDetails(selectedYatri, hotiAllocationDetails, fileData);
  //   }
  //   clearFormFields();
  //   setShowLoader(false);
  //   setToastMessage(
  //     selectedYatri.ticketType === "CHILD" && ticketType !== "CHILD"
  //       ? "Yatri added as child successfully, Please check added details in Children ticket section"
  //       : "Yatri details added successfully"
  //   );
  //   setToastSeverity("success");
  //   setToastOpen(true);
  //   if (!addMore || isEditting) {
  //     setShowForm(false);
  //   } else {
  //     setShowForm(true);
  //   }
  //   closeToast();
  // };

  // const goToForm = () => {
  //   setShowForm(true);
  //   if (formEl.current) {
  //     highlightDivContainer(formEl);
  //   }
  // };

  // const [showForm, setShowForm] = useState(!yatriList.length);

  // const deleteYatri = async () => {
  //   setShowModal(false);
  //   setShowLoader(true);
  //   setLoaderText("Deleting Yatri...");
  //   await deleteYatriById(
  //     hotiAllocationDetails.hotiId,
  //     selectedYatriForModification
  //   );
  //   setYatriDetails(
  //     yatriDetails.filter(
  //       (yatri) => yatri.yatriId !== selectedYatriForModification.yatriId
  //     )
  //   );
  //   setToastMessage("Yatri deleted successfully");
  //   setToastSeverity("success");
  //   setToastOpen(true);
  //   closeToast();
  //   setShowLoader(false);
  // };

  // function isFormValid(selectedYatri: YatriFormFieldType) {
  //   switch (true) {
  //     case !selectedYatri.fullName:
  //       setErrorField("fullName");
  //       return false;
  //     case !selectedYatri.dateOfBirth ||
  //       dateValidator(selectedYatri, ticketType, "mobile"):
  //       setErrorField("dateOfBirth");
  //       return false;
  //     case !selectedYatri.mobile || isMobileInvalidNumber(selectedYatri.mobile):
  //       setErrorField("mobile");
  //       return false;
  //     case !selectedYatri.idProof || aadharValidator(selectedYatri):
  //       setErrorField("idProof");
  //       return false;
  //     case !selectedYatri.city:
  //       setErrorField("city");
  //       return false;
  //     case !fileData && !isEditting:
  //       setToastMessage("Please upload a photo");
  //       setToastSeverity("error");
  //       setToastOpen(true);
  //       closeToast();
  //       setErrorField("profilePicture");
  //       return false;
  //     default:
  //       setErrorField("");
  //       return true;
  //   }
  // }

  // function closeToast() {
  //   setTimeout(() => {
  //     setToastOpen(false);
  //   }, 5000);
  // }

  const handleGoBack = () => {
    //   // if (isEditting) {
    //   //   setIsEditting(false);
    //   //   setShowForm(false);
    //   //   setSelectedYatriForModification({} as YatriDetails);
    //   //   // clearFormFields();
    //   //   // setIsUpdatingProfilePic(false);
    //   // } else {
    setIsDataConfirmed(false);
    //   }
  };

  // const handleModalClose = () => {
  //   setSelectedYatriForModification({} as YatriDetails);
  //   setIsEditting(false);
  //   setShowModal(false);
  // };

  return (
    <>
      <Box display="flex" justifyContent="space-between" marginBottom="8px">
        {/* {(!yatriList.length ||
          yatriList?.length <
            FormFields(hotiAllocationDetails)[ticketType].seatQuota ||
          !yatriList.length ||
          ticketType === "CHILD") &&
          !isEditting &&
          (hotiAllocationDetails.allowChanges ||
            currentUser === "+919049778749" ||
            currentUser === "+919422045027") && (
            <Button color="secondary" onClick={goToForm}>
              <Add />
              Add Passenger
            </Button>
          )} */}
        <Button color="secondary" onClick={handleGoBack}>
          <ArrowBackIos fontSize="small" />
          Go back
        </Button>
      </Box>
      {/* {showForm &&
        (hotiAllocationDetails.allowChanges ||
          currentUser === "+919049778749" ||
          currentUser === "+919422045027") &&
        (isEditting ||
          yatriList.length <
            FormFields(hotiAllocationDetails)[ticketType].seatQuota ||
          ticketType === "CHILD") && (
          <Card sx={{ marginBottom: "8px" }}>
            <CardHeader
              title={`${isEditting ? "Edit" : "Add"} ${
                FormFields(hotiAllocationDetails)[selectedTab].title
              } yatri details`}
              subheader={
                FormFields(hotiAllocationDetails)[selectedTab].subtitle
              }
              sx={{ color: "#303030" }}
              color="text.secondary"
            />
            <Divider />

            <CardContent ref={formEl}>
              <Grid container spacing={3}>
                {!(isEditting && !isUpdatingProfilePic) && (
                  <Grid item md={6} xs={12}>
                    <FormControl
                      error={errorField === "profilePicture"}
                      sx={{ width: "100%" }}
                      variant="outlined"
                    >
                      <Box
                        sx={{
                          border: `1px solid ${
                            errorField === "profilePicture"
                              ? "#d32f2f"
                              : "#dddddd"
                          }`,
                          borderRadius: "4px",
                          width: "100%",
                        }}
                      >
                        <InputLabel
                          shrink={true}
                          sx={{ backgroundColor: "white" }}
                          htmlFor="component-error"
                        >
                          Add Passenger Photo
                        </InputLabel>
                        <input
                          style={{ padding: "16px" }}
                          onChange={uploadFile}
                          type="file"
                          accept="image/*"
                        />
                      </Box>
                      <FormHelperText>
                        {errorField === "profilePicture"
                          ? "Please add a profile image (maximum upto 1MB)"
                          : "Maximum 1MB"}
                      </FormHelperText>
                    </FormControl>
                    <Box>
                      {imageURL && (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography
                            color={LJNMColors.primary}
                            fontSize="12px"
                            marginRight="8px"
                          >
                            {isUpdatingProfilePic && (
                              <>
                                New Image &gt; <br />
                              </>
                            )}
                            File size:
                            <br />
                            {((fileData as any)?.size / (1024 * 1024)).toFixed(
                              2
                            )}{" "}
                            MB
                          </Typography>
                          <Box flexGrow={1} width="140px" height="140px">
                            <img
                              width="100%"
                              height="100%"
                              style={{ objectFit: "contain" }}
                              src={imageURL}
                              alt="profile pic"
                            />
                          </Box>
                        </Box>
                      )}
                    </Box>
                    {isUpdatingProfilePic && (
                      <Box display="flex" alignItems="center" marginTop="8px">
                        <Typography fontSize="12px" color={LJNMColors.primary}>
                          Previous Image &gt;
                        </Typography>
                        <Box
                          width="140px"
                          display="flex"
                          justifyContent="center"
                        >
                          <ImageDisplayContainer
                            imageRef={selectedYatri.profilePicture}
                            altText={selectedYatri.fullName}
                          />
                        </Box>
                      </Box>
                    )}
                  </Grid>
                )}
                {!isUpdatingProfilePic && (
                  <>
                    <Grid item md={6} xs={12}>
                      <TextField
                        autoFocus={true}
                        fullWidth
                        label="Train Seat Number"
                        name="trainSeat"
                        onChange={handleChange}
                        required
                        value={selectedYatri.trainSeat || ""}
                        variant="outlined"
                        error={errorField === "trainSeat"}
                        helperText={
                          errorField === "trainSeat"
                            ? "Please enter train seat"
                            : " "
                        }
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        autoFocus={true}
                        fullWidth
                        label="Bus Seat Number"
                        name="busSeat"
                        onChange={handleChange}
                        required
                        value={selectedYatri.busSeat || ""}
                        variant="outlined"
                        error={errorField === "busSeat"}
                        helperText={
                          errorField === "busSeat"
                            ? "Please enter bus seat"
                            : " "
                        }
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        autoFocus={true}
                        fullWidth
                        label="Rajgiri Room"
                        name="rajgiriRoom"
                        onChange={handleChange}
                        required
                        value={selectedYatri.rajgiriRoom || ""}
                        variant="outlined"
                        error={errorField === "rajgiriRoom"}
                        helperText={
                          errorField === "rajgiriRoom"
                            ? "Please enter Room number"
                            : " "
                        }
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        autoFocus={true}
                        fullWidth
                        label="Pawapuri Room"
                        name="pawapuriRoom"
                        onChange={handleChange}
                        required
                        value={selectedYatri.pawapuriRoom || ""}
                        variant="outlined"
                        error={errorField === "pawapuriRoom"}
                        helperText={
                          errorField === "pawapuriRoom"
                            ? "Please enter Room number"
                            : " "
                        }
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        autoFocus={true}
                        fullWidth
                        label="Lachwad"
                        name="lachwadRoom"
                        onChange={handleChange}
                        required
                        value={selectedYatri.lachwadRoom || ""}
                        variant="outlined"
                        error={errorField === "lachwadRoom"}
                        helperText={
                          errorField === "lachwadRoom"
                            ? "Please enter Room number"
                            : " "
                        }
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        autoFocus={true}
                        fullWidth
                        label="Bhagalpur"
                        name="bhagalpurRoom"
                        onChange={handleChange}
                        required
                        value={selectedYatri.bhagalpurRoom || ""}
                        variant="outlined"
                        error={errorField === "bhagalpurRoom"}
                        helperText={
                          errorField === "bhagalpurRoom"
                            ? "Please enter Room number"
                            : " "
                        }
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        autoFocus={true}
                        fullWidth
                        label="Shikharji"
                        name="shikharjiRoom"
                        onChange={handleChange}
                        required
                        value={selectedYatri.shikharjiRoom || ""}
                        variant="outlined"
                        error={errorField === "shikharjiRoom"}
                        helperText={
                          errorField === "shikharjiRoom"
                            ? "Please enter Room number"
                            : " "
                        }
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        autoFocus={true}
                        fullWidth
                        label="Banaras"
                        name="banarasRoom"
                        onChange={handleChange}
                        required
                        value={selectedYatri.banarasRoom || ""}
                        variant="outlined"
                        error={errorField === "banarasRoom"}
                        helperText={
                          errorField === "banarasRoom"
                            ? "Please enter Room number"
                            : " "
                        }
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        autoFocus={true}
                        fullWidth
                        label="Enter full name"
                        name="fullName"
                        onChange={handleChange}
                        required
                        value={selectedYatri.fullName || ""}
                        variant="outlined"
                        error={errorField === "fullName"}
                        helperText={
                          errorField === "fullName"
                            ? "Please enter full name"
                            : " "
                        }
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Gender"
                        name="gender"
                        onChange={handleChange}
                        required
                        select
                        SelectProps={{ native: true }}
                        value={selectedYatri.gender}
                        variant="outlined"
                        helperText=" "
                      >
                        {["Male", "Female"].map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Date of birth"
                        name="dateOfBirth"
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={handleChange}
                        required
                        value={
                          isEditting
                            ? new Date(selectedYatri.dateOfBirth)
                                .toISOString()
                                .split("T")[0]
                            : selectedYatri.dateOfBirth || ""
                        }
                        variant="outlined"
                        error={dateValidator(
                          selectedYatri,
                          ticketType,
                          errorField
                        )}
                        helperText={
                          new Date(selectedYatri.dateOfBirth).getTime() >
                          new Date().getTime()
                            ? `Please enter date before ${new Date().toLocaleDateString()}`
                            : new Date(
                                selectedYatri.dateOfBirth
                              ).getFullYear() < 1922
                            ? "Please enter date after 01/01/1922"
                            : ticketType === "CHILD" &&
                              convertToAge(selectedYatri.dateOfBirth) > 5
                            ? "Age should be less than 5 years for child tickets"
                            : convertToAge(selectedYatri.dateOfBirth) <= 5
                            ? `${
                                convertToAge(selectedYatri.dateOfBirth)
                                  ? "Age " +
                                    convertToAge(selectedYatri.dateOfBirth) +
                                    " years. "
                                  : ""
                              }This will be added as a child passenger, no fares will be charged and no berth shall be alotted`
                            : selectedYatri.dateOfBirth
                            ? `Age ${convertToAge(
                                selectedYatri.dateOfBirth
                              )} years`
                            : errorField === "dateOfBirth"
                            ? "Please enter date of birth"
                            : " "
                        }
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Mobile Number"
                        type="phone"
                        name="mobile"
                        onChange={handleChange}
                        required
                        value={selectedYatri.mobile || ""}
                        variant="outlined"
                        error={
                          isMobileInvalidNumber(selectedYatri.mobile) ||
                          errorField === "mobile"
                        }
                        helperText={
                          isMobileInvalidNumber(selectedYatri.mobile)
                            ? "Mobile number should be 10 digits"
                            : errorField === "mobile"
                            ? "Please enter mobile number"
                            : " "
                        }
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Aadhar Card number"
                        name="idProof"
                        onChange={handleChange}
                        required
                        value={selectedYatri.idProof || ""}
                        variant="outlined"
                        error={
                          aadharValidator(selectedYatri) ||
                          errorField === "idProof"
                        }
                        helperText={
                          selectedYatri.idProof?.length !== 12
                            ? "Please enter 12 digit Aadhar number"
                            : !(selectedYatri.idProof || "").match(
                                /^[2-9]{1}[0-9]{11}$/
                              )
                            ? "Please enter valid Aadhar number"
                            : errorField === "idProof"
                            ? "Please enter a valid Aadhar Card number"
                            : ""
                        }
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        onChange={handleChange}
                        required
                        value={selectedYatri.city || ""}
                        variant="outlined"
                        error={errorField === "city"}
                        helperText={
                          errorField === "city" ? "Please enter city" : " "
                        }
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 2,
              }}
            >
              <Button
                onClick={clearFormFields}
                sx={{ marginRight: "8px" }}
                variant="outlined"
              >
                Clear
              </Button>

              {!isEditting && (
                <Button
                  sx={{ marginRight: "8px" }}
                  variant="outlined"
                  onClick={() => addYatriDetails(false)}
                >
                  Save & exit
                </Button>
              )}
              <Button
                variant="contained"
                onClick={() =>
                  isUpdatingProfilePic
                    ? updateProfilePic()
                    : addYatriDetails(true)
                }
              >
                {isEditting ? "Save" : "Save & Add More"}
              </Button>
              {!selectedYatri.isDirty && (
            <Button sx={{ marginX: "8px" }}>
              Enter to {FormFields(hotiAllocationDetails)[selectedTab].next}
            </Button>
          )} 
            </Box>
          </Card>
        )} */}
      {!!yatriList.length && (
        <Box padding="12px" borderRadius="4px" bgcolor="#0000004d">
          <Typography mb={1} color="white" sx={{ textTransform: "capitalize" }}>
            {ticketType.toLowerCase()} passenger details
          </Typography>

          <Grid container>
            {yatriList.map((yatri) => (
              <Grid key={yatri.yatriId} item xs={12} sm={6}>
                <YatriDetailView
                  // hotiAllocationDetails={hotiAllocationDetails}
                  key={yatri.yatriId}
                  yatri={yatri}
                  // handleDelete={() => {
                  //   setIsEditting(false);
                  //   setSelectedYatriForModification(yatri);
                  //   setShowModal(true);
                  // }}
                  // handleEdit={() => {
                  //   setIsEditting(true);
                  //   setSelectedYatriForModification(yatri);
                  //   setShowModal(true);
                  // }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showLoader}
      >
        <CircularProgress color="secondary" />
        <Typography paddingLeft="8px" color="secondary">
          {loaderText}
        </Typography>
      </Backdrop> */}
      {/* <Box display="flex" alignItems="center" justifyContent="space-between">
        {!!hotiAllocationDetails.extraTicketQuota && (
          <Button sx={{ marginX: "4px" }} color="secondary" variant="outlined">
            Enter Extra Tickets
          </Button>
        )}
        {!!hotiAllocationDetails.labhartiTicketQuota && (
          <Button sx={{ marginX: "4px" }} color="secondary" variant="outlined">
            Enter Labharti Tickets
          </Button>
        )}
      </Box> */}
      {/* <Modal
        open={showModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableEnforceFocus
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            left: "2%",
            right: "2%",
            top: "40%",
            transform: "translateY(-50%)",
            boxShadow: 24,
            p: 1,
            px: 2,
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
          {isEditting ? (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              paddingY="20px"
            >
              <ImageDisplayContainer
                imageRef={selectedYatriForModification.profilePicture}
                altText={selectedYatriForModification.fullName}
              />
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-around"
              >
                <Button
                  sx={{ marginBottom: "8px" }}
                  color="secondary"
                  onClick={() => {
                    setShowForm(true);
                    setSelectedYatri({
                      isDirty: true,
                      ...selectedYatriForModification,
                    });
                    setShowModal(false);
                  }}
                >
                  Update Yatri details
                </Button>
                <Button
                  onClick={() => {
                    setShowForm(true);
                    setIsUpdatingProfilePic(true);
                    setSelectedYatri({
                      isDirty: true,
                      ...selectedYatriForModification,
                    });
                    setShowModal(false);
                  }}
                  color="secondary"
                >
                  Update profile picture
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                mb={2}
                mt={1}
              >
                Do you want to delete details of this yatri?
              </Typography>
              <YatriDetailView
                hotiAllocationDetails={hotiAllocationDetails}
                yatri={selectedYatriForModification}
              />
              <Box mt={3} display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={deleteYatri}
                >
                  Yes, confirm
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setShowModal(false)}
                >
                  No
                </Button>
              </Box>
            </>
          )} 
        </Box>
      </Modal> */}
      {/* <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        autoHideDuration={4000}
        message="Please fill this form first!"
      >
        <MuiAlert severity={toastSeverity}>{toastMessage}</MuiAlert>
      </Snackbar> */}
    </>
  );
};

export default AddViewTicketDetails;

// function aadharValidator(
//   selectedYatri: YatriFormFieldType
// ): boolean | undefined {
//   return (
//     selectedYatri.idProof?.length > 0 &&
//     !(selectedYatri.idProof || "").match(/^[2-9]{1}[0-9]{11}$/)
//   );
// }

export function isMobileInvalidNumber(
  mobileNumber: string
): boolean | undefined {
  return mobileNumber?.length > 0 && mobileNumber?.length !== 10;
}

export function isHotiInvalid(hotiNumber: number) {
  const newlyAddedHotiIds = [301, 302];
  return (
    +hotiNumber === 0 ||
    (+hotiNumber > 224 && !newlyAddedHotiIds.includes(+hotiNumber))
  );
}

// function dateValidator(
//   selectedYatri: YatriFormFieldType,
//   ticketType: string,
//   errorField: string | undefined
// ): boolean | undefined {
//   return (
//     new Date(selectedYatri.dateOfBirth).getTime() > new Date().getTime() ||
//     new Date(selectedYatri.dateOfBirth).getFullYear() < 1922 ||
//     (ticketType === "CHILD" && convertToAge(selectedYatri.dateOfBirth) > 5) ||
//     errorField === "dateOfBirth"
//   );
// }

// add id for each yatri, retrieving from hotiAllocationDetails.nextYatriId
