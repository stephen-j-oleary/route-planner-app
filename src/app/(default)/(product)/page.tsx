import type { Metadata } from "next";
import Link from "next/link";

import { Box, Button, Card, CardContent, CardHeader, Container, Stack, Typography } from "@mui/material";

import Hero from "./Hero";
import pages from "@/pages";


export default function HomePage() {
  return (
    <>
      <Hero />

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
                  ["Smart Efficiency", "Loop Mapping automatically calculates the shortest route taking into account live traffic data. This ensures that you always take the quickest route possible, saving you time and reducing fuel consumption."],
                  ["Intuitive Design", "Our platform is designed with user-friendliness in mind. Simply enter your stops, and the system will generate the best route for you. No complex settings, making it perfect for anyone, regardless of technical expertise."],
                  ["Versatile Use", "Our web app is perfect for personal errands and small business deliveries. For personal use, it helps you plan optimized trips for grocery shopping, appointments, and pick-ups, saving you time and effort. For businesses, it streamlines deliveries, boosting efficiency and reducing costs."],
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
  title: "Loop Mapping - Free Route Optimization",
  description: "Discover Loop Mapping, the perfect tool to optimize personal travel routes or small business deliveries. Simplify routing and improve efficiency with our easy to use platform.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_BASE_URL}${pages.root}` },
};