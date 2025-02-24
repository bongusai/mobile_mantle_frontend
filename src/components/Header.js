import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Badge,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  DoorClosedIcon as CloseIcon,
  MenuIcon,
  ShoppingCart,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

function Header(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { logout, currentUser } = useAuth(); // Get user from AuthContext
  const navigate = useNavigate();

  // Fetch cart items count from backend
  const fetchCartCount = async () => {
    if (!currentUser) return; // Ensure user is logged in

    try {
      const response = await axios.get(
        `http://localhost:5000/api/cart/${currentUser.id}`
      );
      const cartItems = response.data.items || [];
      const itemCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      ); // Sum all item quantities
      setCartItemCount(itemCount);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  useEffect(() => {
    fetchCartCount();

    // Poll every 10 seconds to update the cart count
    const interval = setInterval(fetchCartCount, 10000);

    return () => clearInterval(interval);
  }, [currentUser]); // Re-run when user changes

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <motion.div>
        <AppBar
          sx={{
            background: "rgb(179,156,150)",
            transition: "all 0.3s ease",
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ py: 1, justifyContent: "space-between" }}>
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    flexGrow: 1,
                    fontWeight: "bold",
                    fontSize: "2rem", // Default font size
                    background: "linear-gradient(45deg, rgb(255, 255, 255), rgb(255, 220, 220))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    cursor: "pointer",
                    textShadow: "3px 3px 0px rgba(0, 0, 0, 0.3), 6px 6px 0px rgba(0, 0, 0, 0.2)",
                    transform: "perspective(500px) rotateX(10deg) rotateY(-10deg)",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "perspective(500px) rotateX(0deg) rotateY(0deg) scale(1.05)",
                      textShadow: "4px 4px 5px rgba(0, 0, 0, 0.4)",
                    },
                    "@media (max-width: 678px)": {
                      fontSize: "20px", // Font size for screen width <= 678px
                    },
                  }}
                  onClick={() => navigate("/")}>
                  Mobile Mantle
                </Typography>


              </motion.div>

              {/* Right Menu */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* Cart Icon */}
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/cart"
                  sx={{ display: props.customStyles }}
                >
                  <Badge badgeContent={cartItemCount} color="secondary">
                    <ShoppingCart />
                  </Badge>
                </IconButton>

                {/* Logout Button */}
                <Button
                  variant="outlined"
                  onClick={handleLogout}
                  sx={{
                    display: { xs: "none", md: "inline-flex" },
                    border: "2px solid cyan",
                    color: "cyan",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    position: "relative",
                    overflow: "hidden",
                    transition: "0.3s ease-in-out",
                    background: "rgba(0, 255, 255, 0.1)", // Light cyan background
                    boxShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
                    "&:hover": {
                      color: "white",
                      backgroundColor: "rgba(0, 255, 255, 0.7)", // Cyan with 0.7 opacity
                      boxShadow: "0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.6)",
                      borderColor: "white",
                    },
                  }}
                >
                  Logout
                </Button>


                {/* Mobile Menu Button */}
                <Box sx={{ display: { xs: "block", md: "none" } }}>
                  <IconButton
                    color="inherit"
                    onClick={() => setDrawerOpen(true)}
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </motion.div>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 350,
            background: "rgba(37, 38, 64, 0.98)",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: "white" }}>
              Menu
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => setDrawerOpen(false)}
              style={{ width: "80px" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" sx={{ color: "white" }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Header;
