
import { createSelector, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = {
  state: "loading",
  viewMode: "map",
  values: {},
  selectedStop: -1,
  results: {}
}

export const routeFormSlice = createSlice({
  name: "routeForm",
  initialState,
  reducers: {
    setState: (state, { payload }) => {
      state.state = payload;
    },
    setViewMode: (state, { payload }) => {
      state.viewMode = payload;
    },
    setValues: (state, { payload }) => {
      state.values = payload;
    },
    mergeValues: (state, { payload }) => {
      _.merge(state.values, payload);
    },
    setSelectedStop: (state, { payload }) => {
      state.selectedStop = payload;
    },
    setResults: (state, { payload }) => {
      state.results = payload;
    }
  }
})

export const baseSelector = state => state.routeForm;
export const selectState = state => baseSelector(state).state;
export const selectIsState = createSelector(
  selectState,
  (_, value) => value,
  (state, value) => (state === value)
);
export const selectViewMode = state => baseSelector(state).viewMode;
export const selectValues = state => baseSelector(state).values;
export const selectSelectedStop = state => baseSelector(state).selectedStop;
export const selectIsSelectedStop = createSelector(
  selectSelectedStop,
  (_, index) => index,
  (selectedStop, index) => (selectedStop === index)
);
export const selectResults = state => baseSelector(state).results;

export const {
  setState,
  setViewMode,
  setValues,
  mergeValues,
  setSelectedStop,
  setResults
} = routeFormSlice.actions;

export default routeFormSlice.reducer;
