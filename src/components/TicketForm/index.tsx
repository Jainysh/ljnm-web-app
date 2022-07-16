import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";
import { Hoti } from "../../types/hoti";
import TicketDetails from "../TicketDetails";

type TicketFormProps = {
  hotiDetails: Hoti;
};
const TicketForm = ({ hotiDetails }: TicketFormProps) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        pt: 1,
      }}
    >
      <Container maxWidth="lg">
        <Typography fontSize="20px" sx={{ textTransform: "capitalize", mb: 3 }}>
          {hotiDetails.name.toLocaleLowerCase()} Family
        </Typography>
        <Grid container spacing={3}>
          <Grid item lg={8} md={6} xs={12}>
            <TicketDetails />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TicketForm;
