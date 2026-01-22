import React from "react";
import { useState } from "react";

import {
  Container,
  Input,
  Button,
  Text,
  Textarea,
  FileUpload,
} from "@chakra-ui/react";
import { Box, VStack } from "@chakra-ui/react";
import { toaster } from "../components/ui/toaster.jsx";

import { useProductStore } from "../store/product.js";
import { useColorMode } from "../components/ui/color-mode.jsx";

const CreatePage = () => {
  const { colorMode } = useColorMode();

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
  });
  const [uploading, setUploading] = useState(false);

  const { createProduct } = useProductStore();

  const [files, setFiles] = useState([]);
  const [fileKey, setFileKey] = useState(0);

  const parsePrice = (value) => {
    if (!value) return null;

    // Remove spaces
    let cleaned = value.trim();

    // Convert EU format → US format
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");

    const number = Number(cleaned);

    return isNaN(number) ? null : number;
  };

  const handleImageUpload = async (file) => {
    setUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: reader.result }),
        });

        const data = await response.json();

        if (data.success) {
          setNewProduct((newProduct) => ({
            ...newProduct,
            image: data.url,
          }));
          toaster.create({
            title: "Image Uploaded",
            description: "Image uploaded successfully.",
            type: "success",
          });
        } else {
          toaster.create({
            title: "Upload Failed",
            description: data.message || "Failed to upload image",
            type: "error",
          });
        }
      } catch (error) {
        toaster.create({
          title: "Upload Error",
          description:
            error.message || "An error occurred while uploading the image",
          type: "error",
        });
      } finally {
        setUploading(false);
      }
    };
  };

  const handleCreateProduct = async () => {
    // Validation

    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      toaster.create({
        title: "Validation Error",
        description: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    // Parse price

    const parsedPrice = parsePrice(newProduct.price);

    if (parsedPrice === null || parsedPrice <= 0) {
      toaster.create({
        title: "Invalid price",
        description: "Please enter a valid price (e.g. 1200 or 1.200,00)",
        type: "error",
      });
      return;
    }

    const productToSend = {
      ...newProduct,
      price: parsedPrice,
    };

    const { success, message } = await createProduct(productToSend);

    if (!success) {
      toaster.create({
        title: "Error",
        description: message,
        type: "error",
        closable: true,
      });
    } else {
      toaster.create({
        title: "Product Created",
        description: "Product has been created successfully.",
        type: "success",
        closable: true,
      });
      // Reset form
      setNewProduct({
        name: "",
        price: "",
        image: "",
        description: "",
      });
      setFiles([]);
      setFileKey((k) => k + 1);
    }
  };

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
          w={"full"}
          background={colorMode === "light" ? "white" : "gray.900"}
          p={8}
          mt={10}
          shadow={"md"}
          borderRadius={"8px"}
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
                setNewProduct({
                  ...newProduct,
                  price: e.target.value,
                })
              }
            />

            <FileUpload.Root
              key={fileKey}
              value={files}
              onValueChange={setFiles}
            >
              <FileUpload.HiddenInput
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleImageUpload(file);
                }}
              />
              <FileUpload.Trigger asChild>
                <Button variant="outline" size="sm">
                  Upload image
                </Button>
              </FileUpload.Trigger>
              <FileUpload.List />
            </FileUpload.Root>
            <Textarea
              placeholder="Write a short description of the product"
              name="description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
            <Button
              colorScheme="blue"
              onClick={handleCreateProduct}
              isDisabled={!newProduct.image || uploading}
              w="full"
            >
              {uploading ? "Uploading image..." : "Create Product"}
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreatePage;
