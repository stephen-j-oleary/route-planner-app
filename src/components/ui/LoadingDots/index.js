import CircleIcon from "@mui/icons-material/Circle";
import { Stack } from "@mui/material";

const DOT_COUNT = 3;


export default function LoadingDots({
  size = 40,
  color = "inherit",
  ...props
}) {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={.5}
      paddingY={2}
      {...props}
    >
      {
        new Array(DOT_COUNT).fill(0).map((_item, i) => (
          <CircleIcon
            key={i}
            fontSize={`calc(${size} / 3)`}
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