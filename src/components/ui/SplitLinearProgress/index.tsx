import { LinearProgress, LinearProgressProps, Stack } from "@mui/material";


export type SplitLinearProgressProps = Omit<LinearProgressProps, "variant"> & {
  segmentCount: number,
};

export default function SplitLinearProgress({
  value: _value = 100,
  segmentCount,
  ...props
}: SplitLinearProgressProps) {
  const segments = new Array(segmentCount).fill(0).map((_, i) => {
    const value = Math.min((_value * segmentCount) - (100 * i), 100);
    return { value };
  });

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      spacing={.5}
      width="100%"
    >
      {
        segments.map((segment, i) => (
          <LinearProgress
            key={i}
            variant="determinate"
            sx={{ flexGrow: 1 }}
            {...segment}
            {...props}
          />
        ))
      }
    </Stack>
  );
}