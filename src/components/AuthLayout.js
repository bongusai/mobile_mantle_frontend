import React from 'react';
import { Box, Container, Paper } from '@mui/material';

const AuthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(45deg,rgb(91, 92, 97) 30%,rgb(127, 149, 170) 90%)',
        padding: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            padding: { xs: 2, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'black',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '200%',
              height: '200%',
              background: 'linear-gradient(45deg, #ff7eb3, #ffbf69, #7ed6df)',
              opacity: 0.8,
              clipPath: 'polygon(0% 50%, 25% 45%, 50% 50%, 75% 55%, 100% 50%, 100% 100%, 0% 100%)',
              animation: 'zigzagAnimation 6s infinite linear',
            },
            '@keyframes zigzagAnimation': {
              '0%': { transform: 'translateX(-10%) translateY(0px)' },
              '50%': { transform: 'translateX(10%) translateY(10px)' },
              '100%': { transform: 'translateX(-10%) translateY(0px)' },
            },
          }}
          
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;
