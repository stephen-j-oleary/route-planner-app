import { Circle } from "@mui/icons-material";
import { IconProps, Stack, StackProps } from "@mui/material";

const DOT_COUNT = 3;


export type LoadingDotsProps =
  & StackProps
  & {
    size?: number,
    color?: IconProps["color"],
  };

export default function LoadingDots({
  size = 40,
  color = "inherit",
  ...props
}: LoadingDotsProps) {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={.5}
      paddingY={2}
      fontSize={`calc(${size} / 3)`}
      {...props}
    >
      {
        new Array(DOT_COUNT).fill(0).map((_item, i) => (
          <Circle
            key={i}
            fontSize="inherit"
            color={color}
            sx={{
              "@keyframes bounce": {
                "0%, 50%, 100%": { transform: "translateY(0)" },
                "25%": { transform: "translateY(-25%)" },
              },
              animation: "bounce 1.2s infinite ease-in-out",
              animationDelay: `${.2 * i}s`,
            }}
          />
        ))
      }
    </Stack>
  );
}