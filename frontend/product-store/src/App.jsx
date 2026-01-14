import React from "react";
import { useColorMode } from "./components/ui/color-mode";

import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";

import CreatePage from "./pages/CreatePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import Navbar from "./components/Navbar.jsx";

const App = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Box minH={"100vh"}>
        <Navbar colorMode={colorMode} toggleColorMode={toggleColorMode} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/create"
            element={<CreatePage colorMode={colorMode} />}
          />
        </Routes>
      </Box>
    </>
  );
};

export default App;
