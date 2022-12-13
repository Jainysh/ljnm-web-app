import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { LJNMColors } from "../../styles";
import { Hoti } from "../../types/hoti";
import { HotiAllocationDetail } from "../../types/hotiAllocationDetail";
import AddViewTicketDetails, { isHotiInvalid } from "../TicketDetails";
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
import { TextField } from "@mui/material";
import {
  getHotiDetailById,
  updateYatriRoomAllocation,
} from "../../firebase/service";
import { firebaseAuth } from "../../firebase";
import { RoomAllocation } from "../../constants/roomDetails";

type HotiDetailsPageProps = {
  hotiDetails: Hoti;
  hotiAllocationDetails: HotiAllocationDetail;
  yatriDetails: YatriDetails[];
  clearHotiDetails: () => void;
  setYatriDetails: (yariDetails: YatriDetails[]) => void;
  setHotiDetails: (hotiDetails: Hoti) => void;
};
const HotiDetailsPage = ({
  hotiDetails,
  hotiAllocationDetails,
  yatriDetails,
  clearHotiDetails,
  setYatriDetails,
  setHotiDetails,
}: HotiDetailsPageProps) => {
  const [isDataConfirmed, setIsDataConfirmed] = useState(false);
  const [ticketType, setTicketType] = useState<TicketType>("CHILD");
  const [currentUser] = useState(firebaseAuth.currentUser?.phoneNumber);
  const confirmHotiDetails = (type: TicketType) => {
    setTicketType(type);
    setIsDataConfirmed(true);
  };
  const [termsAcceptedStatus, setTermsAcceptedStatus] = useState(
    localStorage.getItem(LocalStorageKeys.termsAccepted)
  );
  // changes for updating hoti details
  const [hotiNumber, setHotiNumber] = useState(-1);
  const [errorField, setErrorField] = useState("");
  const updateHotiDetails = (e: any) => {
    const hotiNumber = e.target.value;
    if (isHotiInvalid(hotiNumber) || hotiNumber < 0) {
      setErrorField("hotiNumber");
    } else {
      setErrorField("");
    }
    setHotiNumber(hotiNumber);
  };
  const getHotiDetails = async () => {
    const hotiDetails = await getHotiDetailById(hotiNumber);
    setHotiDetails(hotiDetails);
  };

  // ends here
  const checkTermsStatus = () => {
    const termsStatus = localStorage.getItem(LocalStorageKeys.termsAccepted);
    if (termsStatus) {
      setTermsAcceptedStatus("true");
    }
  };

  const updateDetails = () => {
    // SeatDetails.forEach(async (element) => {
    //   await updateYatriSeats(
    //     element.yatriId,
    //     +element.yatriId.split("-")[0],
    //     element.trainSeat,
    //     element.busSeat
    //   );
    // });
    RoomAllocation.forEach(async (element) => {
      await updateYatriRoomAllocation(
        element.yatriId,
        +element.yatriId.split("-")[0],
        element.trainSeat,
        element.busSeat,
        element.rajgiriRoom,
        element.pawapuriRoom,
        element.lachwadRoom,
        element.bhagalpurRoom,
        element.shikharjiRoom
      );
    });
  };
  return (
    <Grid
      container
      margin={0}
      width="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      padding="24px"
    >
      {/* <InfoBanner /> */}
      {termsAcceptedStatus ? (
        <Grid item width="100%" lg={6} md={8} xs={12} overflow="auto">
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
                  {(currentUser === "+919049778749" ||
                    currentUser === "+919422045027") && (
                    <>
                      <TextField
                        fullWidth
                        label="Enter Hoti Number"
                        color="secondary"
                        value={hotiNumber > 0 ? hotiNumber : ""}
                        sx={{
                          color: "fff",
                          input: { color: "white" },
                          marginBottom: "16px",
                          width: "80%",
                        }}
                        focused
                        error={
                          isHotiInvalid(hotiNumber) ||
                          errorField === "hotiNumber"
                        }
                        onChange={updateHotiDetails}
                        type="number"
                        helperText={
                          isHotiInvalid(hotiNumber) ||
                          errorField === "hotiNumber"
                            ? "Please enter a valid Hoti Number"
                            : " "
                        }
                      />
                      <Button color="secondary" onClick={getHotiDetails}>
                        Change
                      </Button>
                    </>
                  )}
                  <Box display="flex" alignItems="center" marginBottom={2}>
                    <Typography
                      fontSize="20px"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {hotiDetails.name.toLocaleLowerCase()} Family
                    </Typography>
                  </Box>
                  <Typography fontSize="18px" sx={{ marginBottom: "10px" }}>
                    {hotiDetails.hindiName}
                  </Typography>
                  <Button
                    style={{ display: "none" }}
                    color="secondary"
                    onClick={updateDetails}
                  >
                    Update details
                  </Button>
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
                  {(!!yatriDetails.filter(
                    (yatri) => yatri.ticketType === "CHILD"
                  )?.length ||
                    currentUser === "+919049778749" ||
                    currentUser === "+919422045027") && (
                    <TicketTypeRouter
                      label="Children below 5 yrs"
                      yatriLength={
                        yatriDetails.filter(
                          (yatri) => yatri.ticketType === "CHILD"
                        )?.length || 0
                      }
                      clickHandler={() => confirmHotiDetails("CHILD")}
                    />
                  )}
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
