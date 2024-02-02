import Image from "next/image";
import Link from "next/link";

import { ArrowForwardRounded } from "@mui/icons-material";
import { Box, Button, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";

import { NextPageWithLayout } from "./_app";
import DefaultLayout from "@/components/ui/Layouts/Default";

const HomePage: NextPageWithLayout = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <>
      <Box
        position="relative"
        display="grid"
      >
        <Box
          position="relative"
          maxHeight="80dvh"
          minHeight="60dvh"
          gridColumn={1}
          gridRow={1}
          sx={{
            "::after": {
              content: `""`,
              background: "linear-gradient(to right, rgba(0 0 0 / .8) 30%, rgba(0 0 0 / .3))",
              position: "absolute",
              inset: 0,
            }
          }}
        >
          <Image
            src="/screenshots/route-desktop.png"
            alt="Route demo"
            fill
            objectFit="cover"
            objectPosition="40% 50%"
            sizes="100%"
          />
        </Box>

        <Stack
          position="relative"
          px={3}
          py={5}
          alignItems={isLarge ? "flex-start" : "center"}
          justifyContent="center"
          gridColumn={1}
          gridRow={1}
        >
          <Box>
            <Typography
              color="white"
              component="h1"
              variant="h3"
              textAlign={isLarge ? "left" : "center"}
            >
              Loop Mapping
            </Typography>
            <Typography
              color="white"
              component="p"
              variant="body1"
              textAlign={isLarge ? "left" : "center"}
            >
              Streamline your delivery or travel routes
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            color="primary"
            component={Link}
            href="/routes/create"
            endIcon={<ArrowForwardRounded />}
            sx={{ mt: 5 }}
          >
            Create a route now
          </Button>
        </Stack>
      </Box>
    </>
  );
};

HomePage.getLayout = props => (
  <DefaultLayout
    title="Loop Mapping"
    headingComponent="p"
    {...props}
  />
);


export default HomePage;