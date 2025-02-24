import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Divider,
  Paper,
  Container,
  IconButton,
  Dialog,
  Snackbar,
  Alert,
} from "@mui/material";
import { DeleteOutline, ShoppingCart, Add, Remove } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import MultiStepCheckoutForm from "./MultiStepCheckoutForm.js";
import Header from "./Header.js";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:5000/api";

function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (!userEmail) {
      toast.error("User not logged in!");
      navigate("/login");
      return;
    }
    fetchUserId();
  }, [userEmail, navigate]);

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const fetchUserId = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/getUserId/${userEmail}`
      );
      setUserId(response.data.userId);
    } catch (err) {
      toast.error("Failed to fetch user ID.");
      console.error("Error fetching user ID:", err);
    }
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cart/${userId}`);
      // Validate cart data structure
      const cartData = response.data || { items: [] };
      const validatedItems = cartData.items.filter(
        (item) => item && item.productId && typeof item.productId === "object"
      );
      setCart({ ...cartData, items: validatedItems });
      setError(null);
    } catch (err) {
      setError("Failed to load cart.");
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!productId) return;
    try {
      await axios.delete(`${API_BASE_URL}/cart/${userId}/item/${productId}`);
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter(
          (item) => item?.productId?._id !== productId
        ),
      }));
      toast.success("Item removed from cart!");
    } catch (err) {
      toast.error("Failed to remove item.");
      console.error("Error removing item:", err);
    }
  };

  const updateQuantity = async (productId, change) => {
    if (!productId) return;
    const item = cart.items.find((item) => item?.productId?._id === productId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);

    try {
      await axios.patch(`${API_BASE_URL}/cart/${userId}/item/${productId}`, {
        quantity: newQuantity,
      });

      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.map((item) =>
          item?.productId?._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        ),
      }));
    } catch (err) {
      toast.error("Failed to update quantity.");
      console.error("Error updating quantity:", err);
    }
  };

  const getTotalPrice = () => {
    return cart.items
      .reduce((total, item) => {
        if (!item?.productId?.price) return total;
        return total + item.productId.price * (item.quantity || 1);
      }, 0)
      .toFixed(2);
  };

  const handleProceedToBuy = () => {
    setIsCheckoutOpen(true);
  };

  if (loading) {
    return (
      <Container maxWidth="md" >
        <Box sx={{ mt: 10, textAlign: "center" }}>
          <Typography>Loading cart...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" >
        <Box sx={{ mt: 10, textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="md" 
        sx={{
          marginTop: 15,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mt: 10,
            bgcolor: "rgba(136, 136, 136, 0.6)", // Light cyan background
            borderRadius: 2,
            boxShadow: "0px 4px 10px rgba(0, 255, 255, 0.2)",
         

          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: "primary.main" }}>
            Your Cart
          </Typography>
          {cart.items.length === 0 ? (
            <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
              Your cart is empty
            </Typography>
          ) : (
            <Box>
              <List>
                {cart.items.map((item) => {
                  if (!item?.productId) return null;

                  return (
                    <React.Fragment key={item.productId._id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            alt={item.productId.model || "Product"}
                            src={item.productId.image}
                            variant="square"
                            sx={{ width: 80, height: 80, mr: 2 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.productId.model || "Unknown Product"}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                ₹{(item.productId.price || 0).toFixed(2)}
                              </Typography>
                              {item.productId.discountPrice && (
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ textDecoration: "line-through", ml: 1 }}
                                >
                                  ₹{item.productId.discountPrice.toFixed(2)}
                                </Typography>
                              )}
                              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                <IconButton
                                  onClick={() => updateQuantity(item.productId._id, -1)}
                                  disabled={item.quantity <= 1}
                                  sx={{ border: "2px solid cyan", color: "cyan" }}
                                >
                                  <Remove />
                                </IconButton>
                                <Typography sx={{ mx: 1 }}>{item.quantity || 1}</Typography>
                                <IconButton
                                  onClick={() => updateQuantity(item.productId._id, 1)}
                                  sx={{ border: "2px solid cyan", color: "cyan" }}
                                >
                                  <Add />
                                </IconButton>
                              </Box>
                            </>
                          }
                        />
                        <Button
                          // startIcon={<DeleteOutline />}
                          onClick={() => removeFromCart(item.productId._id)}
                          sx={{
                            border: "2px solid red",
                            color: "red",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            position: "relative",
                            overflow: "hidden",
                            transition: "0.3s ease-in-out",
                            background: "rgba(255, 0, 0, 0.1)",
                            boxShadow: "0 0 10px rgba(255, 0, 0, 0.5)",
         
                            "&:hover": {
                              color: "white",
                              backgroundColor: "rgba(255, 0, 0, 0.7)",
                              boxShadow: "0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.6)",
                              borderColor: "white",
                            },
                            // Media query to hide text below 768px and display icon only
                            "@media (max-width: 768px)": {
                              "& span": {
                                display: "none", // Hides the text
                              },
                              padding: " 0px 0px", // Adjust padding if needed
                            },
                            // Media query to show text on devices wider than 768px
                            "@media (min-width: 768px)": {
                              "& span": {
                                display: "inline", // Shows the text
                              },
                            },
                          }}
                        >
                          <DeleteOutline />
                        </Button>

                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  );
                })}
              </List>
              <Box sx={{ mt: 3, textAlign: "right" }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Total: ₹{getTotalPrice()}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  onClick={handleProceedToBuy}
                  size="large"
                  sx={{
                    border: "2px solid cyan",
                    color: "cyan",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    position: "relative",
                    overflow: "hidden",
                    transition: "0.3s ease-in-out",
                    background: "rgba(0, 255, 255, 0.1)",
                    boxShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
                    "&:hover": {
                      color: "white",
                      backgroundColor: "rgba(0, 255, 255, 0.7)",
                      boxShadow: "0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.6)",
                      borderColor: "white",
                    },
                    // Display on all screen sizes
                    display: "inline-flex", // Remove the condition and set it to always visible
                  }}
                >
                  Proceed to Buy
                </Button>

              </Box>
            </Box>
          )}
        </Paper>

        <Dialog open={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} maxWidth="md" fullWidth>
          <MultiStepCheckoutForm totalPrice={getTotalPrice()} onClose={() => setIsCheckoutOpen(false)} />
        </Dialog>
      </Container>;
    </>
  );
}

export default CartPage;
