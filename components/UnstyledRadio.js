import { useRadioGroup } from "@mui/material";


export default function UnstyledRadio({ render, ...props }) {
  const radioGroupState = useRadioGroup();

  return render(props, radioGroupState);
}