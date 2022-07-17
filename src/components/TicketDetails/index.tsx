import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import React from "react";
import { HotiAllocationDetail } from "../../types/hotiAllocationDetail";

type TicketDetailsProps = {
  hotiAllocationDetails: HotiAllocationDetail;
};
const TicketDetails = ({ hotiAllocationDetails }: TicketDetailsProps) => {
  return (
    <form autoComplete="off" noValidate>
      <Card>
        <CardHeader
          // subheader="The information can be edited"
          title="Yatri details"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                // helperText="Please specify the first name"
                label="Enter name"
                name="firstName"
                // onChange={handleChange}
                required
                // value = {values.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Age"
                name="lastName"
                type="number"
                // onChange={handleChange}
                required
                // value = {values.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Mobile Number"
                type="phone"
                name="phone"
                // onChange={handleChange}
                required
                // value = {values.email}
                variant="outlined"
              />
            </Grid>
            {/* <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                // onChange={handleChange}
                type="number"
                // value = {values.phone}
                variant="outlined"
              />
            </Grid> */}
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Aadhar Card number"
                name="country"
                // onChange={handleChange}
                required
                // value = {values.country}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Gender"
                name="state"
                // onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                // value={values.state}
                variant="outlined"
              >
                {["Male", "Female"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
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
          <Button color="primary" variant="contained">
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default TicketDetails;
