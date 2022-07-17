import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { LJNMColors } from "../../styles";
import { Hoti } from "../../types/hoti";
import { HotiAllocationDetail } from "../../types/hotiAllocationDetail";
import TicketDetails from "../TicketDetails";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { ArrowForwardIos } from "@mui/icons-material";

type TicketFormProps = {
  hotiDetails: Hoti;
  hotiAllocationDetails: HotiAllocationDetail;
  clearHotiDetails: () => void;
};
const TicketForm = ({
  hotiDetails,
  hotiAllocationDetails,
  clearHotiDetails,
}: TicketFormProps) => {
  const [isDataConfirmed, setIsDataConfirmed] = useState(false);
  const confirmHotiDetails = () => setIsDataConfirmed(true);
  return (
    <Grid
      container
      spacing={3}
      height="100vh"
      width="100vw"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item lg={6} md={6} xs={12}>
        {!isDataConfirmed ? (
          <>
            <Typography fontSize="20px" sx={{ mb: 3 }}>
              Please confirm your hoti details
            </Typography>
            <Box
              padding={3}
              border={`1px solid ${LJNMColors.secondary}`}
              borderRadius="4px"
            >
              <Typography
                fontSize="20px"
                sx={{ textTransform: "capitalize", mb: 2 }}
              >
                {hotiDetails.name.toLocaleLowerCase()} Family
              </Typography>
              <Typography fontSize="18px" sx={{ marginBottom: "10px" }}>
                {hotiDetails.hindiName}
              </Typography>
              <Typography
                sx={{
                  textTransform: "capitalize",
                  display: "flex",
                  marginBottom: "8px",
                }}
              >
                <LocationOnIcon sx={{ marginRight: "8px" }} />
                {hotiDetails.city.toLocaleLowerCase()}
              </Typography>
              <Typography sx={{ display: "flex", marginBottom: "8px" }}>
                <PhoneIcon sx={{ marginRight: "8px" }} /> {hotiDetails.mobile}
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mt={5}
              >
                <Button onClick={clearHotiDetails} color="secondary">
                  <ArrowBackIosIcon />
                  Change
                </Button>
                <Button onClick={confirmHotiDetails} color="secondary">
                  Yes, I confirm
                  <ArrowForwardIos />
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          <TicketDetails hotiAllocationDetails={hotiAllocationDetails} />
        )}
      </Grid>
    </Grid>
  );
};

export default TicketForm;
