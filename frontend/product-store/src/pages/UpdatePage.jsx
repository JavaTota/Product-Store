import React, { useEffect, useState } from "react";
import { useProductStore } from "../store/product";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Carousel,
  Container,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useColorMode } from "../components/ui/color-mode";

import { toaster } from "../components/ui/toaster.jsx";

import { LuX } from "react-icons/lu";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const UpdatePage = () => {
  const { id } = useParams();
  const getProductById = useProductStore((state) => state.getProductById);
  const [product, setProduct] = useState(null);
  const { colorMode } = useColorMode();
  const updateProduct = useProductStore((state) => state.updateProduct);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(id);
      setProduct(data);
    };

    fetchProduct();
  }, [id, getProductById]);

  const handleImagesUpload = async (files) => {
    setUploading(true);

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

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: base64Images }),
      });

      const data = await response.json();

      if (data.success) {
        setProduct((prev) => ({
          ...prev,
          images: [...prev.images, ...data.urls],
        }));
        toaster.create({
          title: "Images Uploaded",
          description: "New images added",
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
        description: err.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const parsedPrice = Number(product.price);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toaster.create({
        title: "Invalid price",
        description: "Please enter a valid price",
        type: "error",
      });
      return;
    }

    const result = await updateProduct({
      ...product,
      price: parsedPrice,
    });

    if (result.success) {
      toaster.create({
        title: "Product updated",
        description: "Your changes have been saved",
        type: "success",
      });
      navigate("/");
    } else {
      toaster.create({
        title: "Update failed",
        description: result.message || "Something went wrong",
        type: "error",
      });
    }
  };

  return (
    <>
      {product ? (
        <Container maxW={"container.xl"} textAlign={"center"} py={12}>
          <VStack spacing={8}>
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
              <HStack m={8} gap={2} justify="center" wrap="wrap">
                <Input
                  alignContent="center"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files.length) handleImagesUpload(files);
                  }}
                  width="auto"
                />
                {uploading && <Text>Uploading images...</Text>}
              </HStack>

              <Carousel.Root
                slideCount={product.images.length}
                maxW="2xl"
                gap="4"
              >
                <Carousel.Control justifyContent="center" gap="4" width="full">
                  <Carousel.PrevTrigger asChild>
                    <IconButton size="xs" variant="outline">
                      <LuChevronLeft />
                    </IconButton>
                  </Carousel.PrevTrigger>

                  <Carousel.ItemGroup width="full">
                    {product.images.map((item, index) => (
                      <Carousel.Item key={index} index={index}>
                        <Box position="relative">
                          <Image
                            aspectRatio="16/9"
                            src={item}
                            alt={product.name}
                            w="100%"
                            h="100%"
                            objectFit="cover"
                            borderRadius="md"
                          />
                          <IconButton
                            size="2xs"
                            colorScheme="red"
                            position="absolute"
                            top="2"
                            right="2"
                            icon={<LuX />}
                            onClick={() =>
                              setProduct((prev) => ({
                                ...prev,
                                images: prev.images.filter(
                                  (_, i) => i !== index,
                                ),
                              }))
                            }
                          />
                        </Box>
                      </Carousel.Item>
                    ))}
                  </Carousel.ItemGroup>

                  <Carousel.NextTrigger asChild>
                    <IconButton size="xs" variant="outline">
                      <LuChevronRight />
                    </IconButton>
                  </Carousel.NextTrigger>
                </Carousel.Control>

                <Carousel.IndicatorGroup>
                  {product.images.map((item, index) => (
                    <Carousel.Indicator
                      key={index}
                      index={index}
                      unstyled
                      _current={{
                        outline: "2px solid currentColor",
                        outlineOffset: "2px",
                      }}
                    >
                      <Image
                        w="20"
                        aspectRatio="16/9"
                        src={item}
                        alt={product.name}
                        objectFit="cover"
                      />
                    </Carousel.Indicator>
                  ))}
                </Carousel.IndicatorGroup>
              </Carousel.Root>

              <Card.Body gap="2">
                <Card.Title>
                  <Input
                    placeholder="Product Name"
                    name="name"
                    value={product.name}
                    onChange={(e) =>
                      setProduct({ ...product, name: e.target.value })
                    }
                  />
                </Card.Title>
                <Card.Description>
                  <Textarea
                    placeholder="Write a short description of the product"
                    name="description"
                    value={product.description}
                    onChange={(e) =>
                      setProduct({ ...product, description: e.target.value })
                    }
                  />
                </Card.Description>

                <Flex mt="2" align="center" justify="center" gap={1}>
                  <Text
                    textStyle="2xl"
                    fontWeight="medium"
                    letterSpacing="tight"
                    mt="2"
                  >
                    $
                  </Text>
                  <Input
                    placeholder="Price"
                    name="price"
                    value={product.price}
                    onChange={(e) =>
                      setProduct({ ...product, price: e.target.value })
                    }
                  />
                </Flex>
              </Card.Body>
              <Card.Footer gap="2">
                <Button variant="solid" onClick={handleSave}>
                  Save Changes
                </Button>
                <Button variant="outline">
                  <Link to="/">Cancel</Link>
                </Button>
              </Card.Footer>
            </Card.Root>
          </VStack>
        </Container>
      ) : (
        <Container maxW={"container.xl"} textAlign={"center"} py={12}>
          <VStack spacing={8}>
            <p>Loading...</p>
          </VStack>
        </Container>
      )}
    </>
  );
};

export default UpdatePage;
