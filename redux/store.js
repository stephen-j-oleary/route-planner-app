
import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "./slices/map.js";
import routeFormReducer from "./slices/routeForm.js";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    routeForm: routeFormReducer
  },
})
