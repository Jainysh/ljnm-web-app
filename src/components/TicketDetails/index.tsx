import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
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
};
const TicketDetails = ({ hotiAllocationDetails }: TicketDetailsProps) => {
  const [selectedTab, setSelectedTab] = useState<TicketType>("CHILD");

  const [selectedYatri, setSelectedYatri] = useState<YatriFormFieldType>({
    isDirty: false,
  } as YatriFormFieldType);
  const [toastOpen, setToastOpen] = useState(false);

  const handleTabChange = (e: any, newVal: string) => {
    console.log("selectedYatri", selectedYatri);
    if (selectedYatri.isDirty) {
      setToastOpen(true);
    } else {
      setSelectedTab(newVal as any);
    }
  };

  const handleChange = (e: any) => {
    const selectedYatriLocal = selectedYatri;
    selectedYatriLocal[e.target.name as string] = e.target.value;
    selectedYatriLocal.isDirty = true;
    setSelectedYatri({ ...selectedYatriLocal });
    console.log("clocked", selectedYatriLocal);
  };

  const clearFormFields = () => {
    setSelectedYatri({
      isDirty: false,
    } as YatriFormFieldType);
  };

  return (
    <form autoComplete="off" noValidate>
      <Box sx={{ maxWidth: "100%" }}>
        <Tabs
          onChange={handleTabChange}
          textColor="secondary"
          variant="scrollable"
          value={selectedTab}
          scrollButtons="auto"
          sx={{
            button: { color: "#fff" },
            ".MuiTabs-scrollButtons.Mui-disabled": {
              opacity: 0.3,
            },
            ".MuiTabs-scrollButtons": {
              color: "#fff",
            },
          }}
          allowScrollButtonsMobile={true}
        >
          <Tab
            sx={{ paddingLeft: "4px" }}
            label="Child tickets"
            value="CHILD"
          />
          <Tab label="Labharti tickets" value="LABHARTI" />
          <Tab label="Hoti tickets" value="HOTI" />
          <Tab label="Extra tickets" value="EXTRA" />
        </Tabs>
      </Box>
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
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          {selectedYatri.isDirty && (
            <Button
              onClick={clearFormFields}
              sx={{ marginX: "8px" }}
              variant="outlined"
            >
              Clear
            </Button>
          )}
          {!selectedYatri.isDirty && (
            <Button sx={{ marginX: "8px" }}>
              Enter to {FormFields(hotiAllocationDetails)[selectedTab].next}
            </Button>
          )}
          {selectedYatri.isDirty && (
            <Button sx={{ marginX: "8px" }} color="primary" variant="contained">
              Save
            </Button>
          )}
        </Box>
      </Card>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        autoHideDuration={4000}
        message="Please fill all fields first!"
      >
        <MuiAlert severity="info" sx={{ width: "100%" }}>
          Please fill all fields first!
        </MuiAlert>
      </Snackbar>
    </form>
  );
};

export default TicketDetails;
