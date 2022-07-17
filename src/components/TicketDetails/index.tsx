import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { HotiAllocationDetail } from "../../types/hotiAllocationDetail";
import { TicketType, YatriDetails } from "../../types/yatriDetails";
import { FormFields } from "./constant";
import MuiAlert from "@mui/material/Alert";

type YatriFormFieldType = YatriDetails & {
  isDirty: boolean;
  [key: string]: any;
};

type TicketDetailsProps = {
  hotiAllocationDetails: HotiAllocationDetail;
  ticketType: TicketType;
  setIsDataConfirmed: (data: boolean) => void;
};
const TicketDetails = ({
  hotiAllocationDetails,
  ticketType,
  setIsDataConfirmed,
}: TicketDetailsProps) => {
  const [selectedTab, setSelectedTab] = useState<TicketType>(ticketType);

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

  const routeToTicket = (ticketType: TicketType) => {
    // if (selectedYatri.isDirty) {
    //   setToastOpen(true);
    // } else {
    setSelectedTab(ticketType);
    // }
  };

  return (
    <>
      <Card>
        <CardHeader
          subheader={FormFields(hotiAllocationDetails)[selectedTab].subtitle}
          sx={{ color: "#303030" }}
          color="text.secondary"
          title={FormFields(hotiAllocationDetails)[selectedTab].title}
        />
        <Divider />
        <CardContent>
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
                value={selectedYatri.gender || "Male"}
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
              onClick={() => setIsDataConfirmed(false)}
              variant="outlined"
            >
              Go back
            </Button>
          </Box>
          <Box>
            <Button
              onClick={clearFormFields}
              sx={{ marginX: "8px" }}
              variant="outlined"
            >
              Clear
            </Button>
            <Button sx={{ marginX: "8px" }} color="primary" variant="contained">
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
      <Box display="flex" alignItems="center" justifyContent="space-between">
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
      </Box>
      {false && <Button onClick={() => routeToTicket("HOTI")}>test</Button>}

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

export default TicketDetails;
