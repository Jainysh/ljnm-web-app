import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import "./App.css";
import { getHotiDetailById } from "./firebase/service";

const App = () => {
  const addDetails = async () => {
    const hotiDetails = await getHotiDetailById(hotiNumber);
    console.log(hotiDetails);
    setHotiDetails(hotiDetails);
  };
  const [hotiNumber, setHotiNumber] = useState(-1);
  const [hotiDetails, setHotiDetails] = useState({});

  const updateHotiDetails = (e) => setHotiNumber(e.target.value);

  return (
    <div className="App">
      <header className="App-header">
        <img src="/logo.jpeg" width="100px" alt="logo" />
        <p>Get Hoti Details</p>
        <Box display="flex" justifyContent="center">
          <TextField
            error={hotiNumber === 0 || hotiNumber > 225}
            onKeyUp={updateHotiDetails}
            type="number"
            helperText={
              hotiNumber === 0 || hotiNumber > 225 ? "Invalid Hoti Number" : ""
            }
          />
          <Button
            variant="contained"
            disabled={!hotiNumber || hotiNumber > 224}
            onClick={addDetails}
          >
            Show hoti
          </Button>
        </Box>
        {hotiDetails.name && (
          <Box padding="16px">
            <Typography>
              {hotiDetails.name} ({hotiDetails.hindiName}) <br />
              City: {hotiDetails.city} <br />
              Number: {hotiDetails.mobile}
            </Typography>
          </Box>
        )}
      </header>
    </div>
  );
};

export default App;
