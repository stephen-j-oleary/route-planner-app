import Image from "next/image";
import Link from "next/link";

import { Box, Button, Card, CardContent, CardHeader, Container, Stack, Typography } from "@mui/material";

import DefaultLayout from "@/components/Layouts/Default";


export default function Pricing() {
  return (
    <>
      <Box position="relative" minHeight="100dvh">
        <Stack
          spacing={2}
          padding={5}
          alignItems="flex-start"
          position="absolute"
          zIndex={1}
          sx={{ inset: 0 }}
        >
          <Typography component="h1" variant="h3">Loop Mapping</Typography>
          <Typography component="p" variant="body1">Streamline your delivery or travel routes</Typography>
          <Button
            variant="contained"
            size="medium"
            component={Link}
            href="/routes/create"
          >
            Plan a route now
          </Button>
        </Stack>
        <Box position="absolute" sx={{ inset: 0 }}>
          <Image
            src="/landing_image.png"
            alt="Background Image"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "left",
            }}
          />
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ paddingY: 3 }}>
        <Stack spacing={4} paddingY={2}>
          <Typography component="h2" variant="h4">
            For Business
          </Typography>

          <Stack
            direction="row"
            spacing={2}
          >
            <Card sx={{ flex: 1 }}>
              <CardHeader
                title="Faster routes"
              />
              <CardContent>
                <Typography component="p" variant="body1">
                  Our software uses advanced algorithms to calculate the most efficient routes for your deliveries
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardHeader
                title="Reduced fuel costs"
              />
              <CardContent>
                <Typography component="p" variant="body1">
                  By optimizing your routes, our software minimizes the distance you need to travel, reducing overall fuel consumption
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardHeader
                title="Improved customer satisfaction"
              />
              <CardContent>
                <Typography component="p" variant="body1">
                  Faster and more accurate delivery estimates mean happier customers
                </Typography>
              </CardContent>
            </Card>
          </Stack>

          <Stack alignItems="center">
            <Button
              variant="contained"
              size="medium"
              component={Link}
              href="/pricing#business"
            >
              View business pricing
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

Pricing.getLayout = props => (
  <DefaultLayout
    title="Pricing"
    headingComponent="p"
    {...props}
  />
);