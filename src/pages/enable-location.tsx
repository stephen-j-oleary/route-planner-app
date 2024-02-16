import { Container, Typography } from "@mui/material";

import { NextPageWithLayout } from "@/pages/_app";


const EnableLocationPage: NextPageWithLayout = () => (
  <Container maxWidth="lg" sx={{ py: 5 }}>
    <Typography variant="h1" lineHeight={1.5}>Enable location</Typography>

    <Typography variant="body1">
      Some services offered by Loop Mapping perform best when location access is enabled. Here&apos;s a guide on how to enable location permission in the most common web browsers.
    </Typography>

    <Typography variant="h2" lineHeight={1.75}>
      Google Chrome
    </Typography>

    <Typography variant="body1" component="ol">
      <Typography component="li">
        Navigate to Loop Mapping
      </Typography>

      <Typography component="li">
        Click on the padlock icon or information icon in the address bar (left side)
      </Typography>

      <Typography component="li">
        Select &quot;Site settings&quot; from the dropdown menu
      </Typography>

      <Typography component="li">
        Find the &quot;Location&quot; option in the permissions list and set to &quot;Allow&quot;
      </Typography>

      <Typography component="li">
        Refresh the page for the changes to take effect
      </Typography>
    </Typography>

    <Typography variant="h2" lineHeight={1.75}>
      Mozilla Firefox
    </Typography>

    <Typography variant="body1" component="ol">
      <Typography component="li">
        Navigate to Loop Mapping
      </Typography>

      <Typography component="li">
        Click on the padlock icon to open the control panel
      </Typography>

      <Typography component="li">
        Under &quot;Permissions&quot;, find &quot;Access Your Location&quot; and set to &quot;Allow&quot;
      </Typography>

      <Typography component="li">
        Refresh the page for the changes to take effect
      </Typography>
    </Typography>

    <Typography variant="h2" lineHeight={1.75}>
      Microsoft Edge
    </Typography>

    <Typography variant="body1" component="ol">
      <Typography component="li">
        Navigate to Loop Mapping
      </Typography>

      <Typography component="li">
        Click on the padlock icon to open the site information panel
      </Typography>

      <Typography component="li">
        Under &quot;Permissions&quot;, find &quot;Location&quot; and set to &quot;Allow&quot;
      </Typography>

      <Typography component="li">
        Refresh the page for the changes to take effect
      </Typography>
    </Typography>

    <Typography variant="h2" lineHeight={1.75}>
      Safari
    </Typography>

    <Typography variant="body1" component="ol">
      <Typography component="li">
        Navigate to Loop Mapping
      </Typography>

      <Typography component="li">
        Click on the padlock icon to reveal a menu
      </Typography>

      <Typography component="li">
        Select &quot;Settings for This Website&quot;, find &quot;Location&quot; and set to &quot;Allow&quot;
      </Typography>

      <Typography component="li">
        Refresh the page for the changes to take effect
      </Typography>
    </Typography>
  </Container>
);


export default EnableLocationPage