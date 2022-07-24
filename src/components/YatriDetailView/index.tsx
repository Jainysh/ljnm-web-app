import { Box, Typography } from "@mui/material";
import React from "react";
import { convertToAge } from "../../lib/helper";
import { YatriDetails } from "../../types/yatriDetails";
import PhoneIcon from "@mui/icons-material/Phone";
import { LJNMColors } from "../../styles";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase";

type YatriDetailViewProps = {
  yatri: YatriDetails;
};

const YatriDetailView = ({ yatri }: YatriDetailViewProps) => {
  const [imageURL, setImageURL] = React.useState("loading");
  React.useEffect(() => {
    const doExecute = async () => {
      if (yatri.profilePicture) {
        console.log("yatri.profilePicture", yatri.profilePicture);
        const imageRef = ref(await storage, yatri.profilePicture);

        const image = await getDownloadURL(imageRef);
        if (image) {
          console.log("image", image);
          setImageURL(image);
        } else {
          setImageURL("");
        }
        console.log("image not found", image);
      } else {
        setImageURL("");
      }
    };
    doExecute();
  }, [yatri.profilePicture]);

  return (
    <Box
      borderBottom={`3px dashed ${LJNMColors.primary}`}
      borderRight={`1px dashed ${LJNMColors.primary}`}
      key={yatri.yatriId}
      borderRadius="8px"
      bgcolor="white"
      display="flex"
      alignItems="center"
      // marginBottom="8px"
      padding="8px"
    >
      <Box
        width="100px"
        height="100px"
        border={`1px solid ${LJNMColors.primary}`}
        sx={{ overflow: "hidden", borderRadius: "8px" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {imageURL && imageURL !== "loading" ? (
          <img
            src={imageURL}
            width="100%"
            height="100%"
            style={{ objectFit: "contain", borderRadius: "8px" }}
            alt={yatri.fullName}
          />
        ) : (
          <>
            <Typography
              textAlign="center"
              fontSize="14px"
              color={LJNMColors.primary}
            >
              {imageURL === "loading" ? "Loading..." : "Image not uploaded"}
            </Typography>
          </>
        )}
      </Box>
      <Box paddingLeft="8px">
        <Typography color={LJNMColors.primary} fontSize="12px">
          Yatri Id: {yatri.yatriId}
        </Typography>
        <Typography fontWeight={600} color={LJNMColors.primary} fontSize="15px">
          {yatri.fullName}
        </Typography>
        <Typography color={LJNMColors.primary} fontSize="14px">
          <>
            {yatri.gender} -{" "}
            {convertToAge(
              yatri.dateOfBirth instanceof Date
                ? yatri.dateOfBirth
                : yatri.dateOfBirth.toDate()
            )}{" "}
            years
          </>
        </Typography>
        <Typography
          color={LJNMColors.primary}
          fontSize="14px"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <PhoneIcon sx={{ marginRight: "8px", fontSize: "16px" }} />{" "}
          {yatri.mobile}
        </Typography>
      </Box>
    </Box>
  );
};

export default YatriDetailView;
