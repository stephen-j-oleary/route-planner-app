import { Card } from "@mui/material";


export default function SelectableCard({ isSelected = false, ...props }) {
  return (
    <Card
      {...props}
      elevation={isSelected ? 4 : 2}
      sx={{
        borderColor: theme => theme.palette.primary.light,
        borderWidth: isSelected ? "1px" : 0,
        borderStyle: "solid",
      }}
    />
  );
}