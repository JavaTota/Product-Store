import React from "react";

import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/toaster.jsx";

import CreatePage from "./pages/CreatePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import Navbar from "./components/Navbar.jsx";

const App = () => {
  return (
    <>
      <Toaster />
      <Box minH={"100vh"}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
        </Routes>
      </Box>
    </>
  );
};

export default App;
