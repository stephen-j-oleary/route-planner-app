import Image from "next/image";
import Link from "next/link";

import { ArrowForwardRounded } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";

import { NextPageWithLayout } from "./_app";
import DefaultLayout from "@/components/ui/Layouts/Default";

const HomePage: NextPageWithLayout = () => {
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
            priority
          />
        </Box>

        <Stack
          position="relative"
          px={3}
          py={5}
          alignItems={{ xs: "center", sm: "flex-start" }}
          justifyContent="center"
          gridColumn={1}
          gridRow={1}
        >
          <Box>
            <Typography
              color="white"
              component="h1"
              variant="h3"
              textAlign={{ xs: "center", sm: "left" }}
            >
              Loop Mapping
            </Typography>
            <Typography
              color="white"
              component="p"
              variant="body1"
              textAlign={{ xs: "center", sm: "left" }}
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