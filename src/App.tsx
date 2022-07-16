import HomeComponent from "./pages/home";
import { createTheme } from "@mui/material/styles";

import React from "react";
import { ThemeProvider } from "@mui/material";
import { LJNMColors } from "./styles";
// import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";

// use default theme
// const theme = createTheme();

// Or Create your Own theme:
const theme = createTheme({
  palette: {
    primary: {
      main: LJNMColors.primary,
      contrastText: "#ffffff",
    },
    secondary: {
      main: LJNMColors.secondary,
      contrastText: "#dadfe1",
    },
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <HomeComponent />
  </ThemeProvider>
);

export default App;
