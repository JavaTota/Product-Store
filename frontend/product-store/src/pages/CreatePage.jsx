import React from "react";
import { useState } from "react";

import { Container, Input, Button } from "@chakra-ui/react";
import { Box, Heading, VStack } from "@chakra-ui/react";

import { useProductStore } from "../store/product.js";

const CreatePage = ({ colorMode }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });

  const { createProduct } = useProductStore();

  const handleCreateProduct = async () => {
    const { success, message } = await createProduct(newProduct);
    console.log("success:", success);
    console.log("message:", message);
  };
  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8}>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          Create Product
        </Heading>
        <Box
          w={"full"}
          background={colorMode === "light" ? "white" : "gray.800"}
          p={6}
          shadow={"md"}
        >
          <VStack spacing={4}>
            <Input
              placeholder="Product Name"
              name="name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <Input
              placeholder="Price"
              name="price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <Input
              placeholder="Image URL"
              name="imageUrl"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
            />
            <Button colorScheme="blue" onClick={handleCreateProduct} w="full">
              Create Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreatePage;
