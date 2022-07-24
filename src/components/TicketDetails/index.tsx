import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import React, { useEffect, useRef, useState } from "react";
import { HotiAllocationDetail } from "../../types/hotiAllocationDetail";
import { addPassengerDetails } from "../../firebase/service";
import { TicketType, YatriDetails } from "../../types/yatriDetails";
import { FormFields } from "./constant";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import YatriDetailView from "../YatriDetailView";
import { Add, ArrowBackIos } from "@mui/icons-material";
import { convertToAge, highlightDivContainer } from "../../lib/helper";
import Typography from "@mui/material/Typography";

type YatriFormFieldType = YatriDetails & {
  isDirty: boolean;
  [key: string]: any;
};

type TicketDetailsProps = {
  hotiAllocationDetails: HotiAllocationDetail;
  yatriDetails: YatriDetails[];
  ticketType: TicketType;
  setIsDataConfirmed: (data: boolean) => void;
};

const AddViewTicketDetails = ({
  hotiAllocationDetails,
  ticketType,
  setIsDataConfirmed,
  yatriDetails,
}: TicketDetailsProps) => {
  const selectedTab: TicketType = ticketType;
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<AlertColor>("info");
  const [selectedYatri, setSelectedYatri] = useState<YatriFormFieldType>({
    isDirty: false,
  } as YatriFormFieldType);
  const [toastOpen, setToastOpen] = useState(false);

  const handleChange = (e: any) => {
    const selectedYatriLocal = selectedYatri;
    selectedYatriLocal[e.target.name as string] = e.target.value;
    selectedYatriLocal.isDirty = true;
    console.log(e.target.value);
    if (e.target.name === "idProof") {
      console.log((e.target.value || "").match(/^[2-9]{1}[0-9]{11}$/));
    }
    setSelectedYatri({ ...selectedYatriLocal });
  };

  const clearFormFields = () => {
    setErrorField("");
    setSelectedYatri({
      isDirty: false,
    } as YatriFormFieldType);
  };

  const [yatriList, setYatriList] = useState<YatriDetails[]>(
    yatriDetails.filter((yatri) => yatri.ticketType === ticketType)
  );

  useEffect(() => {
    console.log("yatrid etails updated", yatriDetails);
    setYatriList(
      yatriDetails.filter((yatri) => yatri.ticketType === ticketType)
    );
  }, [yatriDetails, ticketType]);

  const [errorField, setErrorField] = useState<string>();

  const formEl = useRef<HTMLDivElement>(null);

  const addYatriDetails = async (addMore = false) => {
    if (!selectedYatri.isDirty) {
      setToastMessage("Please fill all the fields");
      setToastSeverity("error");
      setToastOpen(true);
      closeToast(setToastOpen);
      return;
    }
    switch (true) {
      case !selectedYatri.fullName:
        setErrorField("fullName");
        return;
      case !selectedYatri.dateOfBirth ||
        dateValidator(selectedYatri, ticketType, "mobile"):
        setErrorField("dateOfBirth");
        return;
      case !selectedYatri.mobile || mobileValidator(selectedYatri):
        setErrorField("mobile");
        return;
      case !selectedYatri.idProof || aadharValidator(selectedYatri):
        setErrorField("idProof");
        return;
    }
    if (convertToAge(selectedYatri.dateOfBirth) <= 5) {
      selectedYatri.ticketType = "CHILD";
    } else {
      selectedYatri.ticketType = selectedTab;
    }
    await addPassengerDetails(selectedYatri, hotiAllocationDetails);
    clearFormFields();
    setToastMessage(
      selectedYatri.ticketType === "CHILD"
        ? "Yatri added as child successfully, Please check added details in Children ticket section"
        : "Yatri details added successfully"
    );
    setToastSeverity("success");
    setToastOpen(true);
    if (!addMore) {
      setShowForm(false);
    } else {
      setShowForm(true);
    }
    closeToast(setToastOpen);
  };

  const goToForm = () => {
    setShowForm(true);
    if (formEl.current) {
      highlightDivContainer(formEl);
    }
  };

  const [showForm, setShowForm] = useState(!yatriList.length);

  return (
    <>
      <Box display="flex" justifyContent="space-between" marginBottom="8px">
        {(yatriList?.length <
          FormFields(hotiAllocationDetails)[ticketType].seatQuota &&
          !!yatriList.length) ||
          (ticketType === "CHILD" && (
            <Button color="secondary" onClick={goToForm}>
              <Add />
              Add Passenger
            </Button>
          ))}
        <Button color="secondary" onClick={() => setIsDataConfirmed(false)}>
          <ArrowBackIos fontSize="small" />
          Go back
        </Button>
      </Box>
      {showForm &&
        (yatriList.length <
          FormFields(hotiAllocationDetails)[ticketType].seatQuota ||
          ticketType === "CHILD") && (
          <Card sx={{ marginBottom: "8px" }}>
            <CardHeader
              title={`Add ${
                FormFields(hotiAllocationDetails)[selectedTab].title
              } passenger details`}
              subheader={
                FormFields(hotiAllocationDetails)[selectedTab].subtitle
              }
              sx={{ color: "#303030" }}
              color="text.secondary"
            />
            <Divider />

            <CardContent ref={formEl}>
              <Grid container spacing={3}>
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
                      errorField === "fullName" ? "Please enter full name" : " "
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
                    value={selectedYatri.dateOfBirth || ""}
                    variant="outlined"
                    error={dateValidator(selectedYatri, ticketType, errorField)}
                    helperText={
                      new Date(selectedYatri.dateOfBirth).getTime() >
                      new Date().getTime()
                        ? `Please enter date before ${new Date().toLocaleDateString()}`
                        : new Date(selectedYatri.dateOfBirth).getFullYear() <
                          1922
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
                        ? `Age ${convertToAge(selectedYatri.dateOfBirth)}years`
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
                      mobileValidator(selectedYatri) || errorField === "mobile"
                    }
                    helperText={
                      mobileValidator(selectedYatri)
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
                      aadharValidator(selectedYatri) || errorField === "idProof"
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

              <Button
                sx={{ marginRight: "8px" }}
                variant="outlined"
                onClick={() => addYatriDetails(false)}
              >
                Save & exit
              </Button>
              <Button variant="contained" onClick={() => addYatriDetails(true)}>
                Save & Add More
              </Button>
              {/* {!selectedYatri.isDirty && (
            <Button sx={{ marginX: "8px" }}>
              Enter to {FormFields(hotiAllocationDetails)[selectedTab].next}
            </Button>
          )} */}
            </Box>
          </Card>
        )}
      {!!yatriList.length && (
        <Box padding="8px" borderRadius="4px" mb={2} bgcolor="#ffffff3b">
          <Typography mb={1} color="white" sx={{ textTransform: "capitalize" }}>
            {ticketType.toLowerCase()} passenger details
          </Typography>

          <Grid container>
            {yatriList.map((yatri) => (
              <Grid key={yatri.yatriId} item xs={12} md={6} lg={6}>
                <YatriDetailView key={yatri.yatriId} yatri={yatri} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

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

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        autoHideDuration={4000}
        message="Please fill this form first!"
      >
        <MuiAlert severity={toastSeverity}>{toastMessage}</MuiAlert>
      </Snackbar>
    </>
  );
};

export default AddViewTicketDetails;

function aadharValidator(
  selectedYatri: YatriFormFieldType
): boolean | undefined {
  return (
    selectedYatri.idProof?.length > 0 &&
    !(selectedYatri.idProof || "").match(/^[2-9]{1}[0-9]{11}$/)
  );
}

function mobileValidator(
  selectedYatri: YatriFormFieldType
): boolean | undefined {
  return (
    selectedYatri.mobile?.length > 0 && selectedYatri.mobile?.length !== 10
  );
}

function dateValidator(
  selectedYatri: YatriFormFieldType,
  ticketType: string,
  errorField: string | undefined
): boolean | undefined {
  return (
    new Date(selectedYatri.dateOfBirth).getTime() > new Date().getTime() ||
    new Date(selectedYatri.dateOfBirth).getFullYear() < 1922 ||
    (ticketType === "CHILD" && convertToAge(selectedYatri.dateOfBirth) > 5) ||
    errorField === "dateOfBirth"
  );
}

function closeToast(
  setToastOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  setTimeout(() => {
    setToastOpen(false);
  }, 5000);
}
// add id for each yatri, retrieving from hotiAllocationDetails.nextYatriId
