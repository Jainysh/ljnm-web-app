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
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import TicketRoutingContainer from "./TicketRoutingContainer";
import { TicketType, YatriDetails } from "../../types/yatriDetails";

type TicketFormProps = {
  hotiDetails: Hoti;
  hotiAllocationDetails: HotiAllocationDetail;
  yatriDetails: YatriDetails[];
  clearHotiDetails: () => void;
};
const TicketForm = ({
  hotiDetails,
  hotiAllocationDetails,
  yatriDetails,
  clearHotiDetails,
}: TicketFormProps) => {
  const [isDataConfirmed, setIsDataConfirmed] = useState(false);
  const [ticketType, setTicketType] = useState<TicketType>("CHILD");
  const confirmHotiDetails = (type: TicketType) => {
    setTicketType(type);
    setIsDataConfirmed(true);
  };
  return (
    <Grid
      container
      // spacing={3}
      margin={0}
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Grid padding="24px" width="100%" height="100%" lg={6} md={8} xs={12}>
        {!isDataConfirmed ? (
          <>
            <Box
              height="100%"
              border={`1px solid ${LJNMColors.secondary}`}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              borderRadius="4px"
            >
              <Box margin="24px">
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
                <Typography sx={{ display: "flex", marginBottom: "36px" }}>
                  <PhoneIcon sx={{ marginRight: "8px" }} /> {hotiDetails.mobile}
                </Typography>
                {!!hotiAllocationDetails.labhartiTicketQuota && (
                  <TicketRoutingContainer
                    label="Labharti Tickets"
                    clickHandler={() => confirmHotiDetails("LABHARTI")}
                    ticketCount={hotiAllocationDetails.labhartiTicketQuota}
                  />
                )}
                {!!hotiAllocationDetails.hotiTicketQuota && (
                  <TicketRoutingContainer
                    label="Hoti Tickets"
                    clickHandler={() => confirmHotiDetails("HOTI")}
                    ticketCount={hotiAllocationDetails.hotiTicketQuota}
                  />
                )}
                {!!hotiAllocationDetails.extraTicketQuota && (
                  <TicketRoutingContainer
                    label="Extra tickets"
                    clickHandler={() => confirmHotiDetails("EXTRA")}
                    ticketCount={hotiAllocationDetails.extraTicketQuota}
                  />
                )}
              </Box>

              <Box margin="24px">
                <Button
                  sx={{
                    marginTop: 3,
                    fontSize: "14px",
                  }}
                  onClick={clearHotiDetails}
                  color="secondary"
                  variant="outlined"
                >
                  Enter Different Hoti Number
                </Button>
                <Box
                  padding="8px"
                  display="flex"
                  alignItems="center"
                  borderRadius="8px"
                  marginTop={2}
                  sx={{ background: "#00000045" }}
                >
                  <InfoOutlined color="secondary" fontSize="small" />
                  <Typography fontSize="14px" marginLeft="8px">
                    If you find this data incorrect, please contact us at
                    <a
                      style={{
                        textDecoration: "none",
                        color: LJNMColors.secondary,
                      }}
                      href="tel:+919422045027"
                    >
                      {" "}
                      +91 9422045027
                    </a>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </>
        ) : (
          <TicketDetails
            ticketType={ticketType}
            setIsDataConfirmed={setIsDataConfirmed}
            yatriDetails={yatriDetails}
            hotiAllocationDetails={hotiAllocationDetails}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default TicketForm;
