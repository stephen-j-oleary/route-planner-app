import { Box, Divider, ListItem, Stack, Typography } from "@mui/material";

import StopIcon from "@/components/Routes/StopIcons/Item";
import { splitAddressPrimary } from "@/utils/addressHelpers";
import durationToString from "@/utils/durationToString";


export default function LegsListItem({ data, ...props }) {
  const { primary, secondary } = splitAddressPrimary(data.stop.address);


  return (
    <ListItem
      dense
      sx={{
        gap: 2,
        backgroundColor: "background.paper",
        paddingX: 0,
      }}
      {...props}
    >
      <StopIcon>
        {data.index + 1}
      </StopIcon>

      <Box flex="1 1 auto">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          flexWrap="wrap"
        >
          <Box flex={1}>
            <Typography
              component="p"
              variant="body1"
              fontWeight={500}
              sx={theme => theme.limitLines(1)}
            >
              {primary}
            </Typography>

            <Typography
              component="p"
              variant="caption"
              sx={theme => theme.limitLines(1)}
            >
              {secondary}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            textAlign="right"
          >
            {durationToString(data.stop.duration || 0)}
          </Typography>
        </Stack>

        {
          data.leg && (
            <Typography
              component="p"
              variant="body2"
              textAlign="right"
              paddingTop={1}
            >
              {((data.leg.distance.value || 0) / 1000).toFixed(1)} kms

              <Divider
                orientation="vertical"
                component="span"
                sx={{ marginX: 1 }}
              />

              {durationToString(data.leg.duration.value || 0)}
            </Typography>
          )
        }
      </Box>
    </ListItem>
  );
}