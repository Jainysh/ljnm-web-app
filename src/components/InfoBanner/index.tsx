import { Box, Typography } from "@mui/material";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
// import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { LJNMColors } from "../../styles";

const InfoBanner = () => {
  const [showContent, setShowContent] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (bannerRef.current) {
        bannerRef.current.style.transition = "color 1000ms linear";
        // bannerRef.current.scrollIntoView({
        //   behavior: "smooth",
        //   block: "center",
        // });
        bannerRef.current.style.color = !showContent
          ? LJNMColors.secondary
          : "white";
      }
      setShowContent(!showContent);
    }, 2000);
    return () => clearInterval(interval);
  });
  return (
    <Box
      padding="8px"
      display="flex"
      alignItems="center"
      borderRadius="8px"
      margin="16px 0"
      sx={{ background: "#00000045" }}
    >
      {/* <InfoOutlined color="secondary" fontSize="small" /> */}
      {/* <TipsAndUpdatesIcon color="secondary" fontSize="small" /> */}
      <Typography fontSize="30px"> 🙏🏼</Typography>
      <Typography
        textAlign="center"
        ref={bannerRef}
        fontSize="14px"
        marginLeft="8px"
      >
        <strong>11/08/2022</strong> is last day to submit forms.
        <br /> Please fill yatri details before last day.
      </Typography>
    </Box>
  );
};

export default InfoBanner;
