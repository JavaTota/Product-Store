import React from "react";

import { Flex, Text } from "@chakra-ui/react";
import { Container } from "@chakra-ui/react";
import { HStack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { useColorMode } from "./ui/color-mode";
import { CiSquarePlus } from "react-icons/ci";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Container
      maxW={"full"}
      px={4}
      background={colorMode === "light" ? "gray.200" : "gray.900"}
      padding={"2"}
    >
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{ base: "column", sm: "row" }}
      >
        <Text
          fontSize={{ base: "22", sm: "28" }}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          textAlign={"center"}
          bgGradient="to-r"
          gradientFrom="cyan.400"
          gradientTo="blue.500"
          bgClip={"text"}
        >
          <Link to={"/"}>Product Store 🛒</Link>
        </Text>

        <HStack spacing={2} alignItems={"center"}>
          <Link to={"/create"}>
            <Button
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "6px",
                borderRadius: "8px",
                color: "white",
              }}
            >
              {" "}
              <CiSquarePlus />
            </Button>
          </Link>
          <Button
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "6px",
              borderRadius: "8px",
              color: "white",
            }}
            onClick={toggleColorMode}
          >
            {colorMode === "light" ? "🌙" : "☀️"}
          </Button>
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;
