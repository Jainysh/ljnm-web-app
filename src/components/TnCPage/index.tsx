import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import { LJNMColors } from "../../styles";
import Checkbox from "@mui/material/Checkbox";
import { LocalStorageKeys } from "../TicketDetails/constant";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";

type TnCPageProps = {
  termsAccepted: () => void;
};
const TnCPage = ({ termsAccepted }: TnCPageProps) => {
  const acceptTerms = () => {
    localStorage.setItem(LocalStorageKeys.termsAccepted, "true");
    termsAccepted();
  };
  const [accepted, setAccepted] = useState(false);
  return (
    <Box
      padding="20px 8px"
      border={`1px solid ${LJNMColors.secondary}`}
      color="white"
    >
      <Typography marginX="8px">Please read the details carefully</Typography>
      <ul>
        <li>
          होती टिकट का शुल्क रुपिया 5,400/- मात्र एवं एक्स्ट्रा टिकट का शुल्क
          11,115/- मात्र हे।
        </li>
        <li>
          फॉर्म में पूछी गई सभी जानकारी देना अर्थात सभी रिक्त स्थान भरना
          अनिवार्य हे ।
        </li>
        <li>फॉर्म के साथ में 1 MB का अपना फोटो अपलोड करना अनिवार्य हे ।</li>
        <li>
          फॉर्म भरने के बाद तीन दिन तक टिकट की राशि का भुगतान करना अनिवार्य हे ।
        </li>
        <li>
          टिकट की पूर्ण राशि का भुगतान होने के बाद ही आपकी टिकट कन्फर्म मानी
          जाएगी ।
        </li>
        <li>
          अपने आधार कार्ड के जेरॉक्स की प्रत फॉर्म भरने के 8 दिन के अंदर अपने
          सिटी में लोयाना जैन नवयुवक मंडल के सिटी हेड के पास जमा करवाना अनिवार्य
          हे।
        </li>
        <li>
          अगर आपको आपका कन्फर्म टिकट कैंसल करवाना हे तो उसकी राशि का रिफंड कोई
          वेटिंग में होगा तो ही मिलेगा।
        </li>
        <li>
          अपने साथ आनेवाले 5 साल से छोटे बच्चो का विवरण देना जरूरी हे उनको अलग
          से सीट नही दिया जायेगा
        </li>
        <li>आखरी निर्णय कमेटी का रहेगा</li>
      </ul>
      <Box
        display={"flex"}
        borderTop="1px solid #ffffff66"
        justifyContent="space-between"
        paddingTop="8px"
      >
        <Box display="flex" alignItems="center" paddingRight="8px">
          <Checkbox
            sx={{ color: LJNMColors.secondary }}
            color="secondary"
            onChange={(ev) => setAccepted(ev.target.checked)}
            checked={accepted}
          />
          <Typography>I have read terms</Typography>
        </Box>
        <Button
          color="secondary"
          sx={{ marginRight: "12px" }}
          onClick={acceptTerms}
          disabled={!accepted}
        >
          Continue <ArrowForwardIos />
        </Button>
      </Box>
    </Box>
  );
};

export default TnCPage;
