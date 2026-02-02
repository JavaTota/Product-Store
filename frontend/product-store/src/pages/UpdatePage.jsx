import React, { useEffect, useState } from "react";
import { useProductStore } from "../store/product";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useColorMode } from "../components/ui/color-mode";

const UpdatePage = () => {
  const { id } = useParams();
  const getProductById = useProductStore((state) => state.getProductById);
  const [product, setProduct] = useState(null);
  const { colorMode } = useColorMode();
  const updateProduct = useProductStore((state) => state.updateProduct);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(id);
      setProduct(data);
    };

    fetchProduct();
  }, [id, getProductById]);

  const handleSave = async () => {
    await updateProduct(product);
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
              <Image
                src={product.image}
                alt={product.name}
                style={{ borderRadius: "8px 8px 0 0" }}
              />
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
                <Button variant="solid" onClick={handleSave}>
                  Save
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
