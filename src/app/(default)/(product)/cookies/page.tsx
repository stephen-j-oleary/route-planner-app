import Link from "next/link";

import { Box, Container, Typography } from "@mui/material";


export default function CookiesPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box pb={3}>
        <Typography variant="h1">Cookie Policy</Typography>
        <Typography variant="caption" component="p">Updated: Feb 7, 2024</Typography>
      </Box>

      <Box py={1}>
        <Typography variant="h2" lineHeight={1.5}>1. Introduction</Typography>
        <Box pl={{ sm: 5 }}>
          <Typography variant="body1" component="p">Welcome to Loop Mapping! This Cookie Policy explains how we use cookies and similar tracking technologies on our website. By using our website, you consent to the use of cookies as described in this policy.</Typography>
        </Box>
      </Box>

      <Box py={1}>
        <Typography variant="h2" lineHeight={1.5}>2. What are Cookies?</Typography>
        <Box pl={{ sm: 5 }}>
          <Typography variant="body1" component="p">Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the website owners.</Typography>
        </Box>
      </Box>

      <Box py={1}>
        <Typography variant="h2" lineHeight={1.5}>3. Types of Cookies We Use</Typography>
        <Box pl={{ sm: 5 }}>
          <Typography variant="h3" lineHeight={1.5}>Essential Cookies</Typography>
          <Typography variant="body1" component="p">These cookies are necessary for the proper functioning of our website. They enable you to navigate our site and use its features.</Typography>

          <Typography variant="h3" lineHeight={1.5}>Analytics Cookies</Typography>
          <Typography variant="body1" component="p">We use analytics cookies to understand how visitors interact with our website. The information collected is used to improve the performance and user experience of the site.</Typography>

          <Typography variant="h3" lineHeight={1.5}>Advertising Cookies</Typography>
          <Typography variant="body1" component="p">We may use advertising cookies to deliver relevant advertisements to you based on your interests. These cookies also help measure the effectiveness of our advertising campaigns.</Typography>

          <Typography variant="h3" lineHeight={1.5}>Third-Party Cookies</Typography>
          <Typography variant="body1" component="p">Some of our pages may contain content from third-party websites, such as social media plugins or embedded videos. These third parties may use their own cookies. We have no control over the placement of cookies by third-party websites.</Typography>
        </Box>
      </Box>

      <Box py={1}>
        <Typography variant="h2" lineHeight={1.5}>4. How to Manage Cookies</Typography>
        <Box pl={{ sm: 5 }}>
          <Typography variant="body1" component="p">Most web browsers allow you to control cookies through their settings. You can usually find these settings in the &quot;Options&quot; or &quot;Preferences&quot; menu of your browser. However, disabling certain cookies may impact your experience on our website.</Typography>
        </Box>
      </Box>

      <Box py={1}>
        <Typography variant="h2" lineHeight={1.5}>5. Changes to this Cookie Policy</Typography>
        <Box pl={{ sm: 5 }}>
          <Typography variant="body1" component="p">We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this policy periodically for any updates.</Typography>
        </Box>
      </Box>

      <Box py={1}>
        <Typography variant="h2" lineHeight={1.5}>6. Contact Us</Typography>
        <Box pl={{ sm: 5 }}>
          <Typography variant="body1" component="p">If you have any questions or concerns about our Cookie Policy, please contact us at <Link href="mailto:loopmapping@gmail.com">loopmapping@gmail.com</Link>.</Typography>
        </Box>
      </Box>
    </Container>
  );
}

export const metadata = {
  title: "Loop Mapping - Cookie Policy",
};