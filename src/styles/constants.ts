import { Roboto } from "next/font/google";

export const backgroundDefault = "#F4F9FF";

export const font = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});


const themeConstants = {
  backgroundDefault,
};

export default themeConstants;