import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { getImageDownloadUrl } from "../../firebase/service";
import { LJNMColors } from "../../styles";

type ImageDisplayContainerProps = {
  imageRef?: string;
  altText?: string;
};
const ImageDisplayContainer = ({
  imageRef,
  altText,
}: ImageDisplayContainerProps) => {
  const [imageURL, setImageURL] = React.useState("loading");

  React.useEffect(() => {
    const doEffect = async () => {
      if (imageRef) {
        const image = await getImageDownloadUrl(imageRef);
        setImageURL(image);
      }
    };
    doEffect();
  }, [imageRef]);

  return (
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
          alt={altText}
        />
      ) : (
        <>
          <Typography textAlign="center" fontSize="14px" color="#000">
            {imageURL === "loading" ? "Loading..." : "Image not uploaded"}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default ImageDisplayContainer;
