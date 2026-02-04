import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Carousel,
  Container,
  createListCollection,
  IconButton,
  Image,
  Portal,
  Select,
} from "@chakra-ui/react";
import { VStack, Text } from "@chakra-ui/react";
import { Card } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { useProductStore } from "../store/product";
import { useColorMode } from "../components/ui/color-mode";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useCategoryStore } from "../store/categories";

const HomePage = () => {
  const products = useProductStore((state) => state.products);
  const getProducts = useProductStore((state) => state.getProducts);
  const categories = useCategoryStore((state) => state.categories);
  const getCategories = useCategoryStore((s) => s.getCategories);

  const { colorMode } = useColorMode();

  const deleteProduct = useProductStore((state) => state.deleteProduct);

  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredProducts =
    selectedCategory === "" || selectedCategory.length === 0
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleDelete = async (id) => {
    await deleteProduct(id);
  };

  const categoryCollection = createListCollection({
    items: [
      { label: "All Categories", value: "" },
      ...categories.map((cat) => ({ label: cat.name, value: cat._id })),
    ],
  });

  useEffect(() => {
    getProducts();
    getCategories();
  }, [getProducts, getCategories]);

  return (
    <Container maxW={"container.xl"} textAlign={"center"} py={12}>
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
          Current Products ⛷️
        </Text>
        <Box>
          <Select.Root
            collection={categoryCollection}
            value={selectedCategory ? [selectedCategory] : []}
            onValueChange={(e) => {
              setSelectedCategory(e.value[0] || "");
            }}
            size="sm"
            width="300px"
          >
            <Select.HiddenSelect />

            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Filter by category" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>

            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {categoryCollection.items.map((item) => (
                    <Select.Item key={item.value} item={item}>
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Box>

        {/* --- Category Filter Dropdown --- */}

        <Box
          display={{ base: "flex", sm: "grid" }}
          flexDirection={{ base: "column", sm: "unset" }}
          gridTemplateColumns={{ sm: "repeat(3, minmax(0, 1fr))" }}
          justifyContent="center"
          gap="16px"
        >
          {filteredProducts.map((product) => (
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
              <Carousel.Root
                slideCount={product.images.length}
                maxW="xl"
                mx="auto"
                allowMouseDrag
              >
                <Carousel.ItemGroup>
                  {product.images.map((item, index) => (
                    <Carousel.Item key={index} index={index}>
                      <Box w="100%" h="300px" rounded="lg" fontSize="2.5rem">
                        <Image
                          aspectRatio="16/9"
                          src={item}
                          alt={product.name}
                          w="100%"
                          h="100%"
                          objectFit="cover"
                          borderRadius="md"
                        />
                      </Box>
                    </Carousel.Item>
                  ))}
                </Carousel.ItemGroup>

                <Carousel.Control justifyContent="center" gap="4">
                  <Carousel.PrevTrigger asChild>
                    <IconButton size="xs" variant="ghost">
                      <LuChevronLeft />
                    </IconButton>
                  </Carousel.PrevTrigger>

                  <Carousel.Indicators />

                  <Carousel.NextTrigger asChild>
                    <IconButton size="xs" variant="ghost">
                      <LuChevronRight />
                    </IconButton>
                  </Carousel.NextTrigger>
                </Carousel.Control>
              </Carousel.Root>

              <Card.Body gap="2" mb={4}>
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
              <Card.Footer gap="5">
                <Button
                  variant="solid"
                  onClick={() => handleDelete(product._id)}
                  padding={4}
                >
                  Delete
                </Button>
                <Button variant="outline" padding={4}>
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
