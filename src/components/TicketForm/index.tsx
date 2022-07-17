import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";
import { Hoti } from "../../types/hoti";
import { HotiAllocationDetail } from "../../types/hotiAllocationDetail";
import TicketDetails from "../TicketDetails";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Cards from '@mui/material/Card';
import {PassengerDetail} from "../../types/pasengerDetail";
import { useState } from "react";
import {addPassengerDetails} from '../../firebase/service';
type TicketFormProps = {
  hotiDetails: Hoti;
  hotiAllocationDetails: HotiAllocationDetail;
};



const TicketForm = ({ hotiDetails, hotiAllocationDetails }: TicketFormProps) => {
  const [passengers, setPassengers] = useState([] as PassengerDetail[]);
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
        <Typography fontSize="13px">
          Hoti Tickets:{hotiAllocationDetails.hotiTicketQuota}, Labharti Tickets:{hotiAllocationDetails.labhartiTicketQuota}, Extra Tickets: {hotiAllocationDetails.extraTicketQuota}
        </Typography>        
        <Grid container spacing={3}>
          <Grid item lg={8} md={6} xs={12}>
            <TicketDetails savePassengerDetails={(passengerDetail:PassengerDetail)=>{
              setPassengers([...passengers,passengerDetail]);
              addPassengerDetails(passengerDetail, hotiDetails.hotiId );
              }}/>
          </Grid>
          </Grid>
      </Container>
      <br>
      </br>
          <TableContainer  component={Cards}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Id</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Gender</TableCell>
            <TableCell align="right">DoB</TableCell>
            <TableCell align="right">Aadhar Id</TableCell>
            <TableCell align="right">Ticket Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {passengers.map((passenger:PassengerDetail) => (
            <TableRow
              key={passenger.yatriId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {passenger.name}
              </TableCell>              
              <TableCell align="right">{passenger.yatriId}</TableCell>
              <TableCell align="right">{passenger.name}</TableCell>
              <TableCell align="right">{passenger.gender}</TableCell>
              {/* <TableCell align="right">{passenger.dob}</TableCell>
              <TableCell align="right">{passenger.aadharId}</TableCell>
              <TableCell align="right">{passenger.ticketType}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
  );
};

export default TicketForm;
