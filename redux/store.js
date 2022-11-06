
import { configureStore } from "@reduxjs/toolkit";
import map from "./slices/map.js";
import routeForm from "./slices/routeForm.js";

export const store = configureStore({
  reducer: {
    map,
    routeForm
  },
})
