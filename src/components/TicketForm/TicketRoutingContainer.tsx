import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React from "react";

type TicketRoutingContainerProps = {
  label: string;
  clickHandler: () => void;
  ticketCount: number;
};
const TicketRoutingContainer = ({
  label,
  clickHandler,
  ticketCount,
}: TicketRoutingContainerProps) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderBottom="1px solid #7f5435"
      paddingLeft="8px"
      borderRight="none"
      borderLeft="none"
      sx={{
        ":first-of-type": {
          borderTop: "1px solid #7f5435",
        },
      }}
    >
      <Typography>
        {label}: {ticketCount}
      </Typography>
      <Button onClick={clickHandler} color="secondary">
        Enter details&nbsp;
        <ArrowForwardIos />
      </Button>
    </Box>
  );
};

export default TicketRoutingContainer;
