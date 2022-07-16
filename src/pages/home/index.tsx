import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React from "react";
import { useState } from "react";
import { getHotiDetailById, getHotiAllocationDetailById } from "../../firebase/service";
import { Hoti } from "../../types/hoti";
import TicketForm from "../../components/TicketForm";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { IconButton, Typography } from "@mui/material";
import { LJNMColors } from "../../styles";
import { ArrowForwardIos } from "@mui/icons-material";
import { HotiAllocationDetail } from "../../types/hotiAllocationDetail";

const HomeComponent = () => {
  const getHotiDetails = async () => {
    const hotiDetails = await getHotiDetailById(hotiNumber);
    const hotiAllocationDetails = await getHotiAllocationDetailById(hotiNumber);
    setHotiDetails(hotiDetails);
    setHotiAllocationDetails(hotiAllocationDetails);
  };

  const clearHotiDetails = () => setHotiDetails({} as Hoti);
  const [hotiNumber, setHotiNumber] = useState(-1);
  const [hotiDetails, setHotiDetails] = useState<Hoti>({} as Hoti);
  const [hotiAllocationDetails, setHotiAllocationDetails] = useState<HotiAllocationDetail>({} as HotiAllocationDetail);
  const [hasError, setHasError] = useState(false);

  const updateHotiDetails = (e: any) => {
    if (hotiNumber <= 0 || hotiNumber >= 224) {
      setHasError(true);
    } else {
      setHasError(false);
    }
    setHotiNumber(e.target.value);
  };

  return (
    <>
      {!hotiDetails.name ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          sx={{ backgroundColor: LJNMColors.primary }}
          height="100vh"
        >
          <Box
            borderBottom={`1px solid ${LJNMColors.secondary}`}
            borderLeft="none"
            borderRight="none"
            display="flex"
            alignItems="start"
            margin="8px"
            paddingY="8px"
          >
            <img src="/logo.jpeg" width="100px" alt="logo" />
            <Box paddingLeft="16px">
              <Typography variant="h4">LJNM Shikharji Yatra</Typography>
              <Typography margin="8px 0">Passenger details form</Typography>
            </Box>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="baseline"
            marginTop="40px"
          >
            <TextField
              label="Enter Hoti Number"
              color="secondary"
              sx={{ color: "fff", input: { color: "white" } }}
              focused
              error={hotiNumber === 0 || hotiNumber > 225 || hasError}
              onKeyUp={updateHotiDetails}
              type="number"
              helperText={
                hotiNumber === 0 || hotiNumber > 225 || hasError
                  ? "Invalid Hoti Number"
                  : " "
              }
            />
            <IconButton
              color="secondary"
              // disabled={hotiNumber <= 0 || hotiNumber > 224}
              onClick={getHotiDetails}
              sx={{ marginLeft: "16px" }}
            >
              <Typography sx={{ color: "inherit" }} fontSize="20px">
                Go
              </Typography>
              <ArrowForwardIos></ArrowForwardIos>
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box padding="16px">
          <Button onClick={clearHotiDetails} color="secondary">
            <ArrowBackIosIcon />
            Go back
          </Button>
          <TicketForm hotiDetails={hotiDetails} hotiAllocationDetails={hotiAllocationDetails} />
        </Box>
      )}
    </>
  );
};
export default HomeComponent;
