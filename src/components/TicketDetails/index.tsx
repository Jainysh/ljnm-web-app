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
import MuiAlert from "@mui/material/Alert";
import YatriDetailView from "../YatriDetailView";
import { Add, ArrowBackIos } from "@mui/icons-material";
import { highlightDivContainer } from "../../lib/helper";

type YatriFormFieldType = YatriDetails & {
  isDirty: boolean;
  [key: string]: any;
};

type TicketDetailsProps = {
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
  setYatriDetails,
}: TicketDetailsProps) => {
  const selectedTab: TicketType = ticketType;

  const [selectedYatri, setSelectedYatri] = useState<YatriFormFieldType>({
    isDirty: false,
  } as YatriFormFieldType);
  const [toastOpen, setToastOpen] = useState(false);

  const handleChange = (e: any) => {
    const selectedYatriLocal = selectedYatri;
    selectedYatriLocal[e.target.name as string] = e.target.value;
    selectedYatriLocal.isDirty = true;
    setSelectedYatri({ ...selectedYatriLocal });
  };

  const clearFormFields = () => {
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

  const formEl = useRef<HTMLDivElement>(null);

  const addYatriDetails = async () => {
    const result = await addPassengerDetails(
      selectedYatri,
      hotiAllocationDetails,
      selectedTab
    );
    console.log("resolt", result);
    setYatriDetails([...yatriDetails, result]);
    console.log("Passenger details saved successfully");
  };

  const goToForm = () => {
    if (formEl.current) {
      highlightDivContainer(formEl);
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" marginBottom="8px">
        {yatriList.length <
          FormFields(hotiAllocationDetails)[ticketType].seatQuota &&
          !!yatriList.length && (
            <Button color="secondary" onClick={goToForm}>
              <Add />
              Add Passenger
            </Button>
          )}
        <Button color="secondary" onClick={() => setIsDataConfirmed(false)}>
          <ArrowBackIos fontSize="small" />
          Go back
        </Button>
      </Box>
      {yatriList.map((yatri) => (
        <YatriDetailView key={yatri.yatriId} yatri={yatri} />
      ))}

      {yatriList.length <
        FormFields(hotiAllocationDetails)[ticketType].seatQuota && (
        <Card>
          <CardHeader
            title={FormFields(hotiAllocationDetails)[selectedTab].title}
            subheader={FormFields(hotiAllocationDetails)[selectedTab].subtitle}
            sx={{ color: "#303030" }}
            color="text.secondary"
          />
          <Divider />

          <CardContent ref={formEl}>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Enter full name"
                  name="fullName"
                  onChange={handleChange}
                  required
                  value={selectedYatri.fullName || ""}
                  variant="outlined"
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
                  focused
                  label="Date of birth"
                  name="dateOfBirth"
                  type="date"
                  onChange={handleChange}
                  required
                  value={selectedYatri.dateOfBirth || new Date()}
                  variant="outlined"
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
            <Box>
              <Button
                onClick={clearFormFields}
                sx={{ marginX: "8px" }}
                variant="outlined"
              >
                Clear
              </Button>
              <Button
                sx={{ marginX: "8px" }}
                color="primary"
                variant="contained"
                onClick={addYatriDetails}
              >
                Save
              </Button>
            </Box>

            {/* {!selectedYatri.isDirty && (
            <Button sx={{ marginX: "8px" }}>
              Enter to {FormFields(hotiAllocationDetails)[selectedTab].next}
            </Button>
          )} */}
          </Box>
        </Card>
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
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        autoHideDuration={4000}
        message="Please fill this form first!"
      >
        <MuiAlert
          severity="info"
          sx={{
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Please fill all fields first!
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default AddViewTicketDetails;

// add id for each yatri, retrieving from hotiAllocationDetails.nextYatriId
