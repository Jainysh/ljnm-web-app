import { Box, Typography } from "@mui/material";
import React from "react";
import { convertToAge } from "../../lib/helper";
import { YatriDetails } from "../../types/yatriDetails";
import PhoneIcon from "@mui/icons-material/Phone";
import { LJNMColors } from "../../styles";

type YatriDetailViewProps = {
  yatri: YatriDetails;
};

const YatriDetailView = ({ yatri }: YatriDetailViewProps) => {
  return (
    <Box
      borderBottom={`2px dashed ${LJNMColors.primary}`}
      borderRight={`1px dashed ${LJNMColors.primary}`}
      padding="12px"
      key={yatri.yatriId}
      borderRadius="8px"
      bgcolor="white"

      // marginBottom="8px"
    >
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
  );
};

export default YatriDetailView;
