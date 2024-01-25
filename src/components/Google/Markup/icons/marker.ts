import { svgPathData as locationPinIconPath } from "@fortawesome/free-solid-svg-icons/faLocationPin";

import base from "./base";
import Point from "./Point";


const marker: google.maps.Symbol = {
  ...base,
  path: locationPinIconPath,
  anchor: new Point(200, 500),
  labelOrigin: new Point(200, 200),
  scale: .06,
};

export default marker;