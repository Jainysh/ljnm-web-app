import { Box, Typography } from "@mui/material";
import React from "react";
import { convertToAge } from "../../lib/helper";
import { YatriDetails } from "../../types/yatriDetails";
import PhoneIcon from "@mui/icons-material/Phone";
import { LJNMColors } from "../../styles";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import ImageDisplayContainer from "../ImageDisplay";
import LocationOnIcon from "@mui/icons-material/LocationOn";
// import { HotiAllocationDetail } from "../../types/hotiAllocationDetail";
// import { firebaseAuth } from "../../firebase";

type YatriDetailViewProps = {
  yatri: YatriDetails;
  // handleDelete?: () => void;
  // handleEdit?: () => void;
  // hotiAllocationDetails: HotiAllocationDetail;
};

const YatriDetailView = ({
  yatri,
}: // handleDelete,
// handleEdit,
// hotiAllocationDetails,
YatriDetailViewProps) => {
  // const [currentUser] = useState(firebaseAuth.currentUser?.phoneNumber);
  return (
    <Box
      borderBottom={`3px dashed ${LJNMColors.primary}`}
      borderRight={`1px dashed ${LJNMColors.primary}`}
      key={yatri.yatriId}
      borderRadius="8px"
      bgcolor="white"
      // marginBottom="8px"
      padding="8px"
    >
      <Box
        display="flex"
        width="100%"
        justifyContent="between"
        alignItems="center"
      >
        <Box flexGrow={1}>
          <Typography color="#000" fontSize="12px">
            Yatri Id: {yatri.yatriId}
          </Typography>
        </Box>
        {/* {(hotiAllocationDetails.allowChanges ||
          currentUser === "+919049778749" ||
          currentUser === "+919422045027") && (
          <Box display="flex" alignItems="center">
            {handleEdit && (
              <Button onClick={handleEdit} size="small" variant="text">
                Edit
              </Button>
            )}
            {handleDelete && (
              <Button onClick={handleDelete} size="small" variant="text">
                Delete
              </Button>
            )}
          </Box>
        )} */}
      </Box>
      <Box display="flex" alignItems="center">
        <ImageDisplayContainer
          imageRef={yatri.profilePicture}
          altText={yatri.fullName}
        />
        <Box paddingLeft="8px" flexGrow={1}>
          <Typography fontWeight={600} color="#000" fontSize="16px">
            {yatri.fullName}
          </Typography>
          <Typography color="#000" fontSize="15px">
            <>
              {yatri.gender} - {convertToAge(yatri.dateOfBirth)} years
            </>
          </Typography>
          <Typography
            color="#000"
            fontSize="15px"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <PhoneIcon sx={{ marginRight: "8px", fontSize: "16px" }} />{" "}
            {yatri.mobile}
          </Typography>
          <Typography
            color="#000"
            fontSize="15px"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <FingerprintIcon sx={{ marginRight: "8px", fontSize: "16px" }} />{" "}
            {yatri.idProof.replace(/(\d{4})(\d{4})(\d{4})/, "$1-$2-$3")}
          </Typography>
          <Typography
            color="#000"
            fontSize="15px"
            sx={{
              display: "flex",
              alignItems: "center",
              textTransform: "capitalize",
            }}
          >
            <LocationOnIcon sx={{ marginRight: "8px", fontSize: "16px" }} />
            {yatri.city?.toLocaleLowerCase()}
          </Typography>
        </Box>
      </Box>
      <Box bgcolor={"#c38c98"} padding={1} borderRadius="4px" marginX="-8px">
        <Box display={"flex"} justifyContent="space-between">
          <Typography
            color="#000"
            fontSize="15px"
            sx={{
              display: "flex",
              alignItems: "center",
              textTransform: "capitalize",
            }}
          >
            Train seat: {yatri.trainSeat}
          </Typography>
          <Typography
            color="#000"
            fontSize="15px"
            sx={{
              display: "flex",
              alignItems: "center",
              textTransform: "capitalize",
            }}
          >
            Bus seat: {yatri.busSeat}
          </Typography>
        </Box>

        <Typography
          color="#000"
          fontSize="15px"
          sx={{
            display: "flex",
            alignItems: "center",
            textTransform: "capitalize",
          }}
        >
          Rajgiri: {yatri.rajgiriRoom}
        </Typography>
        <Typography
          color="#000"
          fontSize="15px"
          sx={{
            display: "flex",
            alignItems: "center",
            textTransform: "capitalize",
          }}
        >
          Pawapuri: {yatri.pawapuriRoom}
        </Typography>
        <Typography
          color="#000"
          fontSize="15px"
          sx={{
            display: "flex",
            alignItems: "center",
            textTransform: "capitalize",
          }}
        >
          Lachwad: {yatri.lachwadRoom}
        </Typography>
        <Typography
          color="#000"
          fontSize="15px"
          sx={{
            display: "flex",
            alignItems: "center",
            textTransform: "capitalize",
          }}
        >
          Bhagalpur: {yatri.bhagalpurRoom}
        </Typography>
        <Typography
          color="#000"
          fontSize="15px"
          sx={{
            display: "flex",
            alignItems: "center",
            textTransform: "capitalize",
          }}
        >
          Shikharji: {yatri.shikharjiRoom}
        </Typography>
        <Typography
          color="#000"
          fontSize="15px"
          sx={{
            display: "flex",
            alignItems: "center",
            textTransform: "capitalize",
          }}
        >
          Banaras: {yatri.banarasRoom}
        </Typography>
      </Box>
    </Box>
  );
};

export default YatriDetailView;
