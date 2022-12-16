import HomeComponent from "./pages/home";
import { createTheme } from "@mui/material/styles";

import React from "react";
import { ThemeProvider } from "@mui/material";
import { LJNMColors } from "./styles";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import AdminPage from "./pages/admin";
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
    text: {
      primary: "#303030",
      secondary: "#303030",
    },
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
