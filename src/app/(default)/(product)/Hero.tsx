"use client";

import Image from "next/image";

import { ArrowDownwardRounded } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";

import { backgroundDefault } from "@/styles/constants";
import heroImage from "public/map-hero.webp";


export default function Hero() {
  return (
    <Box
      position="relative"
      display="grid"
    >
      <Box
        role="presentation"
        position="relative"
        gridColumn={1}
        gridRow={1}
        height={theme => `calc(100lvh - ${theme.mixins.toolbar.minHeight}px)`}
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
          src={heroImage}
          alt=""
          fill
          sizes="100vw"
          priority
          quality={100}
          placeholder="blur"
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
        height={theme => `calc(100svh - ${theme.mixins.toolbar.minHeight}px)`}
      >
        <Typography
          variant="h1"
          textAlign="center"
          lineHeight={1.4}
        >
          <Typography
            component="span"
            variant="h1"
            color="text.primary"
          >
            Loop Mapping
          </Typography>

          <Typography
            component="span"
            aria-hidden
            sx={{ visibility: "hidden" }}
          > - </Typography>

          <Typography
            component="span"
            variant="h5"
            color="text.secondary"
            display="block"
          >
            Smart route optimization for seamless deliveries and travel
          </Typography>
        </Typography>

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
  );
}