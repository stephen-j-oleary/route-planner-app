import { ArrowForwardRounded } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Skeleton, Stack, Typography } from "@mui/material";


export default function Loading() {
  return (
    <Box
      display="grid"
      gridAutoColumns="1fr"
      gridAutoFlow="column"
      gap={2}
    >
      {
        Array
          .from({ length: 2 })
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader title={<Skeleton variant="text" />} titleTypographyProps={{ fontWeight: 600 }} />

              <CardContent>
                <Typography variant="body1" pb={2}>
                  <Skeleton />
                </Typography>

                <Typography variant="body2" component="ul">
                  {
                    Array.from({ length: 3 }).fill(0).map((_, i) => (
                      <li key={i}><Skeleton /></li>
                    ))
                  }
                </Typography>
              </CardContent>

              <CardActions>
                <Stack spacing={2} width="100%">
                  <Skeleton width="100%" variant="rounded">
                    <Button
                      fullWidth
                      size="large"
                      variant="contained"
                      sx={{ marginInline: "auto" }}
                      endIcon={<ArrowForwardRounded />}
                    >
                      Subscribe
                    </Button>
                  </Skeleton>
                </Stack>
              </CardActions>
            </Card>
          ))
      }
    </Box>
  );
}