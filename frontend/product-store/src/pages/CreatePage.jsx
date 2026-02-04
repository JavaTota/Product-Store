import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Input,
  Button,
  Text,
  Textarea,
  Image,
  HStack,
  VStack,
  Box,
  Select,
  Portal,
  createListCollection,
} from "@chakra-ui/react";

import { toaster } from "../components/ui/toaster.jsx";
import { useColorMode } from "../components/ui/color-mode.jsx";

import { useParsedPrice } from "../store/parse_price.js";
import { useProductStore } from "../store/product.js";
import { useCategoryStore } from "../store/categories.js";

const CreatePage = () => {
  const { colorMode } = useColorMode();
  const { parsePrice } = useParsedPrice();
  const { createProduct } = useProductStore();

  const categories = useCategoryStore((s) => s.categories);
  const getCategories = useCategoryStore((s) => s.getCategories);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    images: [],
    description: "",
    category: "",
  });
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  // --- Fetch categories on mount ---
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // --- Handle multiple file uploads ---
  const handleImagesUpload = async (files) => {
    setUploading(true);

    try {
      const base64Images = await Promise.all(
        Array.from(files).map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(file);
            }),
        ),
      );

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: base64Images }),
      });

      const data = await response.json();

      if (data.success) {
        setNewProduct((prev) => ({
          ...prev,
          images: [...prev.images, ...data.urls],
        }));
        toaster.create({
          title: "Images Uploaded",
          description: "All images uploaded successfully",
          type: "success",
        });
      } else {
        toaster.create({
          title: "Upload Failed",
          description: data.message || "Failed to upload images",
          type: "error",
        });
      }
    } catch (err) {
      toaster.create({
        title: "Upload Error",
        description: err.message || "An error occurred while uploading images",
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  // --- Handle product creation ---
  const handleCreateProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.price ||
      newProduct.images.length === 0 ||
      !newProduct.category
    ) {
      toaster.create({
        title: "Validation Error",
        description: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    const parsedPrice = parsePrice(newProduct.price);
    if (parsedPrice === null || parsedPrice <= 0) {
      toaster.create({
        title: "Invalid price",
        description: "Please enter a valid price",
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
        images: [],
        description: "",
        category: "",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // --- Prepare category collection for Select component ---
  const categoryCollection = createListCollection({
    items: categories.map((cat) => ({
      label: cat.name,
      value: cat._id,
    })),
  });

  return (
    <Container
      maxW={{ base: "1100px", sm: "1200px" }}
      textAlign={"center"}
      py={12}
    >
      <VStack spacing={8}>
        {/* --- Page Title --- */}
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
          Create New Product
        </Text>

        {/* --- Product Creation Form --- */}
        <Box
          w={"full"}
          background={colorMode === "light" ? "white" : "gray.900"}
          p={8}
          mt={10}
          shadow={"md"}
          borderRadius={"8px"}
        >
          <VStack spacing={4}>
            {/* --- Product Name Input --- */}
            <Input
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />

            {/* --- Product Price Input --- */}
            <Input
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />

            {/* --- Multiple Image Upload --- */}
            <Input
              ref={fileInputRef}
              alignContent="center"
              type="file"
              accept="image/*"
              padding={1}
              multiple
              onChange={(e) => handleImagesUpload(e.target.files)}
            />

            {/* --- Display Uploaded Images --- */}
            {newProduct.images.length > 0 && (
              <HStack spacing={2} mt={2} wrap="wrap">
                {newProduct.images.map((url, idx) => (
                  <Image
                    key={idx}
                    src={url}
                    boxSize="80px"
                    objectFit="cover"
                    borderRadius="4px"
                  />
                ))}
              </HStack>
            )}

            {/* --- Product Description Input --- */}
            <Textarea
              placeholder="Write a short description of the product"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />

            {/* --- Category Selection Dropdown --- */}
            <Select.Root
              collection={categoryCollection}
              value={newProduct.category ? [newProduct.category] : []}
              onValueChange={(e) => {
                console.log("Selected category:", e.value);
                setNewProduct({ ...newProduct, category: e.value[0] || "" });
              }}
              size="sm"
            >
              <Select.HiddenSelect />

              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select category" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>

              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {categoryCollection.items.map((item) => (
                      <Select.Item padding={4} key={item.value} item={item}>
                        {item.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            {/* --- Create Product Button --- */}
            <Button
              colorScheme="blue"
              onClick={handleCreateProduct}
              isDisabled={newProduct.images.length === 0 || uploading}
              w="full"
            >
              {uploading ? "Uploading images..." : "Create Product"}
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreatePage;
