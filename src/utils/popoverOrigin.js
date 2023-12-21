export default function popoverOrigin(anchorOrigin, transformOrigin) {
  const [anchorV, anchorH] = anchorOrigin.split(" ");
  const [transformV, transformH] = transformOrigin.split(" ");

  return {
    anchorOrigin: {
      vertical: anchorV,
      horizontal: anchorH,
    },
    transformOrigin: {
      vertical: transformV,
      horizontal: transformH,
    }
  };
}