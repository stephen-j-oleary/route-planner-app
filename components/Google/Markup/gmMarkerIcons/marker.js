import { svgPathData as locationPinIconPath } from "@fortawesome/free-solid-svg-icons/faLocationPin";

import base from "./base";


const marker = {
  ...base,
  path: locationPinIconPath,
  anchor: { x: 200, y: 500 },
  labelOrigin: { x: 200, y: 200 },
  scale: .06,
};

export default marker;