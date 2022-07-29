import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  getHotiDetailById,
  getAllYatriDetailsById,
} from "../../firebase/service";
import { Hoti } from "../../types/hoti";
import HotiDetailsPage from "../../components/HotiDetailsPage";
import { CircularProgress, Grid, IconButton, Typography } from "@mui/material";
import { LJNMColors } from "../../styles";
import { ArrowForwardIos } from "@mui/icons-material";
import { HotiAllocationDetail } from "../../types/hotiAllocationDetail";
import { YatriDetails } from "../../types/yatriDetails";
import { onSnapshot, Unsubscribe, doc } from "firebase/firestore";
import { getFirebaseFirestoreDB } from "../../firebase";
const HomeComponent = () => {
  const getHotiDetails = async () => {
    if (!hotiNumber || hotiNumber <= 0 || hotiNumber >= 224) {
      setHasError(true);
      return;
    }
    setShowLoader(true);
    const hotiDetails = await getHotiDetailById(hotiNumber);
    setHotiDetails(hotiDetails);
    setShowLoader(false);
  };

  const clearHotiDetails = () => setHotiDetails({} as Hoti);
  const [hotiNumber, setHotiNumber] = useState(-1);
  const [hotiDetails, setHotiDetails] = useState<Hoti>({} as Hoti);
  const [yatriDetails, setYatriDetails] = useState<YatriDetails[]>(
    [] as YatriDetails[]
  );
  const [hotiAllocationDetails, setHotiAllocationDetails] =
    useState<HotiAllocationDetail>({} as HotiAllocationDetail);
  const [hasError, setHasError] = useState(false);

  const [showLoader, setShowLoader] = useState(false);

  const updateHotiDetails = (e: any) => {
    const hotiNumber = e.target.value;
    if (hotiNumber <= 0 || hotiNumber >= 224) {
      setHasError(true);
    } else {
      setHasError(false);
    }
    setHotiNumber(hotiNumber);
  };

  const handleSubmit = (e: any) => {
    if (e.key === "Enter") {
      getHotiDetails();
    }
  };

  useEffect(() => {
    let hotiDetailsUnsubscribe: Unsubscribe;
    const doExecute = async () => {
      hotiDetailsUnsubscribe = onSnapshot(
        doc(
          await getFirebaseFirestoreDB(),
          `EventMaster/event-1/hotiAllocation/hoti-${hotiDetails.hotiId}`
        ),
        async (doc) => {
          const hotiAllocationDetails = doc.data();
          if (hotiAllocationDetails) {
            setHotiAllocationDetails(
              hotiAllocationDetails as HotiAllocationDetail
            );
            const yatriDetails = await getAllYatriDetailsById(
              hotiDetails.hotiId
            );
            setYatriDetails(yatriDetails);
          }
        }
      );
    };
    doExecute();
    return () => {
      hotiDetailsUnsubscribe && hotiDetailsUnsubscribe();
    };
  }, [hotiDetails.hotiId]);

  return (
    <>
      {!hotiDetails.name ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          height="100vh"
        >
          <Grid container justifyContent="center">
            <Grid item lg={6} md={8} xs={12}>
              <Box
                borderBottom={`1px solid ${LJNMColors.secondary}`}
                borderLeft="none"
                borderRight="none"
                display="flex"
                flexDirection="column"
                alignItems="center"
                margin="8px"
                paddingY="8px"
              >
                <Box width="100px" height="100px" mb={4}>
                  <img
                    src="/logo.jpeg"
                    width="100%"
                    style={{ objectFit: "contain" }}
                    alt="logo"
                  />
                </Box>
                <Box paddingLeft="16px" textAlign="center">
                  <Typography variant="h4">LJNM Shikharji Yatra</Typography>
                  <Typography margin="8px 0">Passenger details form</Typography>
                </Box>
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="baseline"
                marginTop="40px"
              >
                <TextField
                  label="Enter Hoti Number"
                  color="secondary"
                  value={hotiNumber > 0 ? hotiNumber : ""}
                  sx={{
                    color: "fff",
                    input: { color: "white" },
                    width: "80%",
                    marginLeft: "24px",
                  }}
                  focused
                  onKeyUp={handleSubmit}
                  error={hotiNumber === 0 || hotiNumber > 225 || hasError}
                  onChange={updateHotiDetails}
                  type="number"
                  helperText={
                    hotiNumber === 0 || hotiNumber > 225 || hasError
                      ? "Please enter Hoti number between 1 and 224"
                      : " "
                  }
                />
                <IconButton
                  color="secondary"
                  disabled={showLoader}
                  onClick={getHotiDetails}
                  sx={{ marginLeft: "16px" }}
                >
                  <>
                    <Typography sx={{ color: "inherit" }} fontSize="20px">
                      Go
                    </Typography>
                    {!showLoader ? (
                      <ArrowForwardIos></ArrowForwardIos>
                    ) : (
                      <CircularProgress size={20} color="secondary" />
                    )}
                  </>
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <HotiDetailsPage
          setYatriDetails={setYatriDetails}
          clearHotiDetails={clearHotiDetails}
          hotiDetails={hotiDetails}
          yatriDetails={yatriDetails}
          hotiAllocationDetails={hotiAllocationDetails}
        />
      )}
    </>
  );
};
export default HomeComponent;
