
import { createSelector, createSlice } from "@reduxjs/toolkit";
import resolve from "../../shared/resolve.js";

const initialState = {
  state: "loading",
  values: {
    stops: [],
    options: {}
  },
  selectedStop: -1
}

export const routeFormSlice = createSlice({
  name: "routeForm",
  initialState,
  reducers: {
    setState: (state, { payload }) => {
      state.state = resolve(payload, state.state);
    },
    setValues: (state, { payload }) => {
      state.values = resolve(payload, state.values);
    },
    setSelectedStop: (state, { payload }) => {
      state.selectedStop = resolve(payload, state.selectedStop);
    }
  }
})

export const selectState = state => state.routeForm.state;
export const selectIsState = createSelector(
  selectState,
  (_, value) => value,
  (state, value) => (state === value)
);
export const selectValues = state => state.routeForm.values;
export const selectSelectedStop = state => state.routeForm.selectedStop;
export const selectIsSelectedStop = createSelector(
  selectSelectedStop,
  (_, index) => index,
  (selectedStop, index) => (selectedStop === index)
);

export const actions = routeFormSlice.actions;

export default routeFormSlice.reducer;
