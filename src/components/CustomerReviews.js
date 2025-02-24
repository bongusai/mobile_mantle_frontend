import React from "react"
import { Typography, Box, Avatar, Rating, Container } from "@mui/material"
import { Carousel } from "react-bootstrap"
import { motion } from "framer-motion"
import "bootstrap/dist/css/bootstrap.min.css" // Ensure Bootstrap's CSS is included

const reviews = [
  {
    id: 1,
    name: "Sara Williams",
    rating: 4,
    comment: "Love the design! It fits perfectly and feels premium.",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 2,
    name: "John Doe",
    rating: 4,
    comment: "Fantastic experience, the quality exceeded my expectations.",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    name: "Emily Clark",
    rating: 5,
    comment: "Absolutely amazing! Great value for the money.",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
]

function CustomerReviews() {
  return (
    <Box sx={{ py: 12, bgcolor: "rgb(179,156,150)" }}> {/* Light blue background */}
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          textAlign="center"
          sx={{
            color: "#00796b", // Teal color for heading
            mb: 8,
            fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
            fontWeight: "bold",
          }}
        >
          What Our Customers Say
        </Typography>
        <Carousel
          indicators={true}
          interval={5000}
          controls={true}
          nextIcon={
            <span
              aria-hidden="true"
              className="carousel-control-next-icon"
              style={{
                borderRadius: "50%",
                backgroundColor: "#00796b",
                padding: "10px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#004d40")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#00796b")}
              onClick={(e) => {
                if (e.target.style.backgroundColor === "#004d40") {
                  e.target.style.boxShadow = "0 0 10px rgba(0, 255, 255, 0.7)";
                }
              }}
            />
          }
          prevIcon={
            <span
              aria-hidden="true"
              className="carousel-control-prev-icon"
              style={{
                borderRadius: "50%",
                backgroundColor: "#00796b",
                padding: "10px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#004d40")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#00796b")}
              onClick={(e) => {
                if (e.target.style.backgroundColor === "rgb(179,156,150)") {
                  e.target.style.boxShadow = "0 0 10px rgb(179,156,150)";
                }
              }}
            />
          }
          slide={true}
          fade={true}
        >
          {reviews.map((review) => (
            <Carousel.Item key={review.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center p-4"
              >
                <Avatar
                  alt={review.name}
                  src={review.avatar}
                  sx={{
                    width: { xs: 100, sm: 120, md: 150 },
                    height: { xs: 100, sm: 120, md: 150 },
                    margin: "0 auto",
                    mb: 3,
                    border: "4px solid #00796b", // Teal border for image
                    boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    color: "#004d40", // Dark teal for name
                    fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.2rem" },
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  {review.name}
                </Typography>
                <Rating
                  value={review.rating}
                  readOnly
                  sx={{
                    my: 3,
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.2rem" },
                    color: "#ff9800", // Orange color for stars
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    mt: 3,
                    mb: 5,
                    color: "#616161", // Grey color for comment text
                    fontSize: { xs: "1.1rem", sm: "1.4rem", md: "1.6rem" },
                    fontStyle: "italic",
                    maxWidth: "85%",
                    margin: "0 auto",
                  }}
                >
                  "{review.comment}"
                </Typography>
              </motion.div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </Box>
  )
}

export default CustomerReviews
