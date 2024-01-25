import base from "./base";
import Point from "./Point";

const location: google.maps.Symbol = {
  ...base,
  path: "M429.6 92.1c4.9-11.9 2.1-25.6-7-34.7s-22.8-11.9-34.7-7l-352 144c-14.2 5.8-22.2 20.8-19.3 35.8s16.1 25.8 31.4 25.8H224V432c0 15.3 10.8 28.4 25.8 31.4s30-5.1 35.8-19.3l144-352z",
  anchor: new Point(250, 200),
  labelOrigin: new Point(280, 220),
  scale: .06,
};

export default location;