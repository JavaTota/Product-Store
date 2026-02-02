import React, { useEffect } from "react";

import { Box, Button, Container, Image } from "@chakra-ui/react";
import { VStack, Text } from "@chakra-ui/react";
import { Card } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { useProductStore } from "../store/product";
import { useColorMode } from "../components/ui/color-mode";

const HomePage = () => {
  const products = useProductStore((state) => state.products);

  const getProducts = useProductStore((state) => state.getProducts);

  const { colorMode } = useColorMode();
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  const handleDelete = async (id) => {
    await deleteProduct(id);
  };

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <Container maxW={"container.xl"} textAlign={"center"} py={12}>
      <VStack spacing={8}>
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
          Current Products ⛷️
        </Text>
        <Box
          display="grid"
          gridTemplateColumns="repeat(3, minmax(0, 1fr))"
          justifyContent="center"
          gap="16px"
        >
          {products.map((product) => (
            <Card.Root
              key={product._id}
              m="4px"
              p="8px"
              boxShadow="md"
              borderRadius="8px"
              bg={colorMode === "light" ? "white" : "gray.900"}
              maxW="sm"
              overflow="hidden"
            >
              <Image
                src={
                  product.image ||
                  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                }
                alt={product.name}
                style={{ borderRadius: "8px 8px 0 0" }}
              />
              <Card.Body gap="2">
                <Card.Title>{product.name}</Card.Title>
                <Card.Description>
                  {product.description || "No description available."}
                </Card.Description>
                <Text
                  textStyle="2xl"
                  fontWeight="medium"
                  letterSpacing="tight"
                  mt="2"
                >
                  ${Number(product.price).toFixed(2)}
                </Text>
              </Card.Body>
              <Card.Footer gap="2">
                <Button
                  variant="solid"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </Button>
                <Button variant="outline">
                  <Link to={`/update/${product._id}`}>Update</Link>
                </Button>
              </Card.Footer>
            </Card.Root>
          ))}
          <Card.Root
            m="4px"
            p="8px"
            boxShadow="md"
            borderRadius="8px"
            bg={colorMode === "light" ? "white" : "gray.900"}
            maxW="sm"
            overflow="hidden"
          >
            <Card.Body
              gap="2"
              justifyContent="center"
              alignItems="center"
              textAlign={"center"}
            >
              <Link to={"/create"}>
                <Text
                  textStyle="2xl"
                  fontWeight="medium"
                  letterSpacing="tight"
                  mt="2"
                >
                  ADD A NEW PRODUCT ➕
                </Text>
              </Link>
            </Card.Body>
          </Card.Root>
        </Box>
      </VStack>
    </Container>
  );
};

export default HomePage;
