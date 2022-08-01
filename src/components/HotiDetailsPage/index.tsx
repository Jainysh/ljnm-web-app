import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { LJNMColors } from "../../styles";
import { Hoti } from "../../types/hoti";
import { HotiAllocationDetail } from "../../types/hotiAllocationDetail";
import AddViewTicketDetails from "../TicketDetails";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Button from "@mui/material/Button";
import TicketTypeRouter from "./TicketTypeRouter";
import { TicketType, YatriDetails } from "../../types/yatriDetails";
import { LocalStorageKeys } from "../TicketDetails/constant";
import TnCPage from "../TnCPage";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import RuleIcon from "@mui/icons-material/Rule";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

type HotiDetailsPageProps = {
  hotiDetails: Hoti;
  hotiAllocationDetails: HotiAllocationDetail;
  yatriDetails: YatriDetails[];
  clearHotiDetails: () => void;
  setYatriDetails: (yariDetails: YatriDetails[]) => void;
};
const HotiDetailsPage = ({
  hotiDetails,
  hotiAllocationDetails,
  yatriDetails,
  clearHotiDetails,
  setYatriDetails,
}: HotiDetailsPageProps) => {
  const [isDataConfirmed, setIsDataConfirmed] = useState(false);
  const [ticketType, setTicketType] = useState<TicketType>("CHILD");
  const confirmHotiDetails = (type: TicketType) => {
    setTicketType(type);
    setIsDataConfirmed(true);
  };
  const [termsAcceptedStatus, setTermsAcceptedStatus] = useState(
    localStorage.getItem(LocalStorageKeys.termsAccepted)
  );

  const checkTermsStatus = () => {
    const termsStatus = localStorage.getItem(LocalStorageKeys.termsAccepted);
    if (termsStatus) {
      setTermsAcceptedStatus("true");
    }
  };
  return (
    <Grid
      container
      margin={0}
      width="100%"
      display="flex"
      height="100vh"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {termsAcceptedStatus ? (
        <Grid
          item
          width="100%"
          height="90vh"
          lg={6}
          md={8}
          xs={12}
          overflow="auto"
          padding="24px"
        >
          {!isDataConfirmed ? (
            <>
              <Box
                border={`1px solid ${LJNMColors.secondary}`}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                borderRadius="4px"
              >
                <Box margin="24px 24px 0">
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
                    <PhoneIcon sx={{ marginRight: "8px" }} />{" "}
                    {hotiDetails.mobile}
                  </Typography>
                  {!!hotiAllocationDetails.labhartiTicketQuota && (
                    <TicketTypeRouter
                      yatriLength={
                        yatriDetails.filter(
                          (yatri) => yatri.ticketType === "LABHARTI"
                        )?.length || 0
                      }
                      label="Labharti Tickets"
                      clickHandler={() => confirmHotiDetails("LABHARTI")}
                      ticketCount={hotiAllocationDetails.labhartiTicketQuota}
                    />
                  )}
                  {!!hotiAllocationDetails.hotiTicketQuota && (
                    <TicketTypeRouter
                      yatriLength={
                        yatriDetails.filter(
                          (yatri) => yatri.ticketType === "HOTI"
                        )?.length || 0
                      }
                      label="Hoti Tickets"
                      clickHandler={() => confirmHotiDetails("HOTI")}
                      ticketCount={hotiAllocationDetails.hotiTicketQuota}
                    />
                  )}
                  {!!hotiAllocationDetails.extraTicketQuota && (
                    <TicketTypeRouter
                      label="Extra Tickets"
                      yatriLength={
                        yatriDetails.filter(
                          (yatri) => yatri.ticketType === "EXTRA"
                        )?.length || 0
                      }
                      clickHandler={() => confirmHotiDetails("EXTRA")}
                      ticketCount={hotiAllocationDetails.extraTicketQuota}
                    />
                  )}
                  <TicketTypeRouter
                    label="Children below 5 yrs"
                    yatriLength={
                      yatriDetails.filter(
                        (yatri) => yatri.ticketType === "CHILD"
                      )?.length || 0
                    }
                    clickHandler={() => confirmHotiDetails("CHILD")}
                  />
                  <Box
                    padding="8px"
                    display="flex"
                    alignItems="center"
                    borderRadius="8px"
                    marginTop={2}
                    sx={{ background: "#00000045" }}
                  >
                    {/* <InfoOutlined color="secondary" fontSize="small" /> */}
                    <TipsAndUpdatesIcon color="secondary" fontSize="small" />
                    <Typography fontSize="14px" marginLeft="8px">
                      All the yatri details added, edited or deleted by you will
                      be saved. No additional <strong>Submit</strong> is
                      required
                    </Typography>
                  </Box>
                </Box>

                <Box
                  margin="0 24px 12px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Button
                    sx={{
                      marginTop: 7,
                      fontSize: "14px",
                    }}
                    onClick={clearHotiDetails}
                    color="secondary"
                    variant="outlined"
                  >
                    <PowerSettingsNewIcon
                      fontSize="small"
                      sx={{ marginRight: "8px" }}
                    />{" "}
                    Logout
                  </Button>
                  <Box
                    padding="8px"
                    display="flex"
                    alignItems="center"
                    borderRadius="8px"
                    marginY={1}
                    sx={{ background: "#00000045" }}
                  >
                    {/* <InfoOutlined color="secondary" fontSize="small" /> */}
                    <RuleIcon color="secondary" fontSize="small" />
                    <Typography fontSize="14px" marginLeft="8px">
                      If you find your Hoti or ticket details incorrect, please
                      contact us at{" "}
                      <a
                        style={{
                          textDecoration: "none",
                          color: LJNMColors.secondary,
                          whiteSpace: "nowrap",
                        }}
                        href="tel:+919422045027"
                      >
                        +91-9422045027
                      </a>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </>
          ) : (
            <AddViewTicketDetails
              setYatriDetails={setYatriDetails}
              ticketType={ticketType}
              setIsDataConfirmed={setIsDataConfirmed}
              yatriDetails={yatriDetails}
              hotiAllocationDetails={hotiAllocationDetails}
            />
          )}
        </Grid>
      ) : (
        <Grid item lg={6} md={8} xs={12}>
          <Box padding="20px">
            <TnCPage termsAccepted={checkTermsStatus} />
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default HotiDetailsPage;
