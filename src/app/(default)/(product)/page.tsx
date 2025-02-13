import type { Metadata } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { ArrowDownwardRounded } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardHeader, Container, Stack, Typography } from "@mui/material";

import pages from "@/pages";
import { backgroundDefault } from "@/styles/constants";


export default function HomePage() {
  return (
    <>
      <Head>
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_BASE_URL}${pages.root}`} />
      </Head>

      <Box
        position="relative"
        display="grid"
      >
        <Box
          position="relative"
          height="90dvh"
          gridColumn={1}
          gridRow={1}
          sx={{
            "::after": {
              content: `""`,
              background: `linear-gradient(to bottom, white 0%, transparent 50%, ${backgroundDefault} 100%)`,
              position: "absolute",
              inset: 0,
            }
          }}
        >
          <Image
            src="/map-hero.png"
            alt="Hero image"
            fill
            sizes="100%"
            priority
            style={{
              objectFit: "cover",
              objectPosition: "50% 50%",
            }}
          />
        </Box>

        <Stack
          position="relative"
          px={3}
          py={5}
          alignItems="center"
          justifyContent="space-between"
          gridColumn={1}
          gridRow={1}
        >
          <Box>
            <Typography
              color="text.primary"
              variant="h1"
              textAlign="center"
              lineHeight={1.4}
            >
              Loop Mapping
            </Typography>

            <Typography
              color="text.secondary"
              component="p"
              variant="h5"
              textAlign="center"
              lineHeight={1.4}
            >
              Smart routing for seamless deliveries and travel
            </Typography>
          </Box>

          <Box>
            <Typography
              component="p"
              variant="h2"
              textAlign="center"
            >
              <ArrowDownwardRounded />
            </Typography>

            <Typography
              component="p"
              variant="caption"
              color="text.disabled"
              textAlign="center"
            >
              Learn more
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Container maxWidth="md" sx={{ py: 5, "& h2": { lineHeight: 1.8 } }}>
        <Stack spacing={4}>
          <div>
            <Typography variant="h2">
              Why Loop Mapping?
            </Typography>

            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", sm: "repeat(3, 1fr)" }}
              gap={2}
              py={3}
            >
              {
                [
                  ["Smart Efficiency", "Automatically find the best route to minimize time and fuel costs."],
                  ["Intuitive Design", "Built for simplicity — just add stops and get optimized results."],
                  ["Versatile Use", "Perfect for personal travel, small business deliveries, or field operations."],
                ].map(([title, description]) => (
                  <Card key={title}>
                    <CardHeader title={title} slotProps={{ title: { variant: "h3" }} } />

                    <CardContent>
                      <Typography variant="body1">
                        {description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              }
            </Box>
          </div>

          <div>
            <Typography variant="h2">
              How it works?
            </Typography>

            <Box
              component="ol"
              px={0}
            >
              {
                [
                  ["Create a free account", "Loop Mapping offers a free plan with all the features necessary for personal use. Get started by creating your account and selecting the free plan."],
                  ["Enter your stops and route options", "Begin optimizing a trip by entering your stops in any order, selecting your origin and destination, and optionally include a stop time to account for any time spent at each stop."],
                  ["Calculate the route", "Hit enter and let Loop Mapping automatically optimize your trip."],
                ].map(([title, description], index) => (
                  <Box
                    key={title}
                    component="li"
                    display="grid"
                    gridTemplateColumns={{ sm: "1fr", md: "auto 1fr" }}
                    columnGap={2}
                    sx={{ listStyleType: "none" }}
                  >
                    <Typography component="p" variant="h3" color="text.secondary" py={3} pr={1}>
                      Step {index + 1}
                    </Typography>

                    <Box py={3} sx={{ borderBottomColor: "divider", borderBottomWidth: "1px", borderBottomStyle: "solid" }}>
                      <Typography component="h3" variant="h4" pb={1}>
                        {title}
                      </Typography>

                      <Typography variant="body1">
                        {description}
                      </Typography>
                    </Box>
                  </Box>
                ))
              }

              <Stack alignItems="center">
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  component={Link}
                  href={pages.routes.new}
                  sx={{ my: 2 }}
                >
                  Get started for free
                </Button>
              </Stack>
            </Box>
          </div>
        </Stack>
      </Container>
    </>
  );
}

export const metadata: Metadata = {
  title: "Loop Mapping",
  description: "Discover Loop Mapping, the perfect tool for personal travel or small business deliveries. Simplify routing and improve efficiency with our easy to use platform.",
};