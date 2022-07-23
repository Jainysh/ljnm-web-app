import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React from "react";
import { LJNMColors } from "../../styles";

type TicketTypeRouterProps = {
  label: string;
  clickHandler: () => void;
  ticketCount: number;
  yatriLength: number;
};
const TicketTypeRouter = ({
  label,
  clickHandler,
  ticketCount,
  yatriLength = 0,
}: TicketTypeRouterProps) => {
  return (
    <Box
      borderBottom="1px solid #7f5435"
      padding="8px"
      paddingRight="0"
      borderRight="none"
      borderLeft="none"
      sx={{
        ":first-of-type": {
          borderTop: "1px solid #7f5435",
        },
      }}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box>
        <Typography>{label}</Typography>
        <Typography
          color={LJNMColors.secondary}
          fontSize="14px"
          fontStyle="italic"
        >
          {yatriLength !== ticketCount
            ? `${yatriLength} of ${ticketCount} tickets added`
            : `All ${yatriLength} tickets added`}
        </Typography>
      </Box>
      <Button onClick={clickHandler} color="secondary">
        {yatriLength !== ticketCount
          ? `Add ${yatriLength > 0 ? "/ View" : ""}`
          : "View"}
        &nbsp;
        <ArrowForwardIos />
      </Button>
    </Box>
  );
};

export default TicketTypeRouter;
