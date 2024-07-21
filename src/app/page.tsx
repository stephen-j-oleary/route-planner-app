import Image from "next/image";
import Link from "next/link";

import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";

import pages from "pages";


export default function HomePage() {
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
            sizes="100%"
            priority
            style={{
              objectFit: "cover",
              objectPosition: "40% 50%",
            }}
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
              variant="h1"
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
            href={pages.routes.create}
            sx={{ mt: 5 }}
          >
            Create a route now
          </Button>
        </Stack>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h2" pb={4}>
          How does Loop Mapping work?
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns={{
            sm: "1fr",
            md: "auto 1fr 1fr",
          }}
          columnGap={2}
        >
          <Typography variant="h3" color="text.secondary" py={2} pr={1} gridColumn={1}>
            Step 1
          </Typography>

          <Box gridColumn={{ sm: 1, md: 2 }} py={2}>
            <Typography variant="h4" pb={1}>
              Enter your stops
            </Typography>

            <Typography variant="body1">
              Begin by entering all the stops along your route in any order
            </Typography>
          </Box>

          <Typography variant="h3" color="text.secondary" py={2} gridColumn={1}>
            Step 2
          </Typography>

          <Box gridColumn={{ sm: 1, md: 2 }} py={2} sx={{ borderTopColor: "divider", borderTopWidth: "1px", borderTopStyle: "solid" }}>
            <Typography variant="h4" pb={1}>
              Select your origin and destination
            </Typography>

            <Typography variant="body1">
              Select where you will be starting and ending your trip
            </Typography>
          </Box>

          <Paper
            elevation={4}
            sx={{
              background: "transparent",
              position: "relative",
              minHeight: "30dvh",
              gridColumn: { sm: 1, md: 3 },
              gridRow: { sm: "auto", md: "1 / span 2" },
              overflow: "hidden",
            }}
          >
            <Image
              src="/screenshots/mockup-enterstops.png"
              alt="Enter stops mockup"
              fill
              sizes="100%"
              style={{
                objectFit: "cover",
                objectPosition: "top left",
              }}
            />
          </Paper>

          <Box gridColumn={{ sm: 1, md: "2 / -1" }} height="1px" my={2} sx={{ backgroundColor: "divider" }} />

          <Typography variant="h3" color="text.secondary" py={2} gridColumn={1}>
            Step 3
          </Typography>

          <Box gridColumn={{ sm: 1, md: 3 }} py={2}>
            <Typography variant="h4" pb={1}>
              Add stop time
            </Typography>

            <Typography variant="body1">
              Optionally, include a stop time to add for each location on your loop
            </Typography>
          </Box>

          <Typography variant="h3" color="text.secondary" py={2} gridColumn={1}>
            Step 4
          </Typography>

          <Box gridColumn={{ sm: 1, md: 3 }} py={2} sx={{ borderTopColor: "divider", borderTopWidth: "1px", borderTopStyle: "solid" }}>
            <Typography variant="h4" pb={1}>
              Calculate the route
            </Typography>

            <Typography variant="body1">
              Hit enter and view your optimized route
            </Typography>
          </Box>

          <Paper
            elevation={4}
            sx={{
              background: "transparent",
              position: "relative",
              minHeight: "30dvh",
              gridColumn: { sm: 1, md: 2 },
              gridRow: { sm: "auto", md: "4 / span 2" },
              overflow: "hidden",
            }}
          >
            <Image
              src="/screenshots/mockup-calculated.png"
              alt="Calculated route mockup"
              fill
              sizes="100%"
              style={{
                objectFit: "cover",
                objectPosition: "top left",
              }}
            />
          </Paper>

          <Box gridColumn={{ sm: 1, md: "2 / -1" }} height="1px" my={2} sx={{ backgroundColor: "divider" }} />

          <Stack alignItems="center" gridColumn="1 / -1">
            <Button
              variant="contained"
              size="large"
              color="primary"
              component={Link}
              href="/login?callbackUrl=%2Froutes%2Fcreate"
              sx={{ my: 2 }}
            >
              Get started for free
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
}

export const metadata = {
  title: "Loop Mapping",
};