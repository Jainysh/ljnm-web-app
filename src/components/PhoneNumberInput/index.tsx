import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import React, { BaseSyntheticEvent, useState } from "react";
import { isMobileInvalidNumber } from "../TicketDetails";

type PhoneNumberInputProps = {
  onPhoneNumberSubmit: (phoneNumber: string) => void;
  showLoader: boolean;
};
const PhoneNumberInput = ({
  onPhoneNumberSubmit,
  showLoader = false,
}: PhoneNumberInputProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const handleChange = (ev: BaseSyntheticEvent) => {
    if (ev.target.value.length <= 10) {
      setPhoneNumber(ev.target.value);
    }
  };
  return (
    <>
      <Grid item md={6} xs={12}>
        <TextField
          fullWidth
          autoFocus
          focused
          label="Mobile Number"
          type="phone"
          name="mobile"
          onChange={handleChange}
          required
          value={phoneNumber || ""}
          variant="outlined"
          error={isMobileInvalidNumber(phoneNumber)}
          helperText={
            isMobileInvalidNumber(phoneNumber)
              ? "Mobile number should be 10 digits"
              : " "
          }
        />
        <Button
          id="sign-in-button"
          variant="contained"
          disabled={
            !phoneNumber || isMobileInvalidNumber(phoneNumber) || showLoader
          }
          onClick={() => onPhoneNumberSubmit(phoneNumber)}
        >
          Generate OTP&nbsp;
          {showLoader ? (
            <CircularProgress size={16} />
          ) : (
            <ArrowForwardIos sx={{ fontSize: "14px" }}></ArrowForwardIos>
          )}
        </Button>
      </Grid>
    </>
  );
};
export default PhoneNumberInput;
