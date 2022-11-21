
import _ from "lodash";
import { createSelector, createSlice } from "@reduxjs/toolkit";

const DEFAULT_CENTER = { lat: 51.0447, lng: -114.0719 };
const DEFAULT_ZOOM = 10;
const DEFAULT_OPTIONS = {
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false
}

const initialState = {
  state: "loading",
  options: DEFAULT_OPTIONS,
  markup: [],
  selectedMarkup: null,
  hoveredMarkup: null,
  markers: [],
  selectedMarker: null,
  hoveredMarker: null,
  polylines: [],
  selectedPolyline: -1,
  hoveredPolyline: -1
}

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setState: (state, { payload }) => {
      state.state = payload;
    },
    setOptions: (state, { payload }) => {
      state.options = payload;
    },
    mergeOptions: (state, { payload }) => {
      _.merge(state.options, payload);
    },
    setMarkup: (state, { payload }) => {
      state.markup = payload;
    },
    mergeMarkup: (state, { payload }) => {
      state.markup = _.unionBy(state.markup, payload, "id");
    },
    removeMarkup: (state, { payload }) => {
      state.markup = _.reject(state.markup, v => v.id === payload || (_.isArray(payload) && payload.includes(v.id)));
    },
    setSelectedMarkup: (state, { payload }) => {
      state.selectedMarkup = payload;
    },
    setHoveredMarkup: (state, { payload }) => {
      state.hoveredMarkup = payload;
    },
    /* setMarkers: (state, { payload }) => {
      state.markers = payload;
    }, */
    mergeMarkers: (state, { payload }) => {
      state.markers = [...state.markers, ...payload];
    },
    setSelectedMarker: (state, { payload }) => {
      state.selectedMarker = payload;
    },
    setHoveredMarker: (state, { payload }) => {
      state.hoveredMarker = payload;
    },
    setPolylines: (state, { payload }) => {
      state.polylines = payload;
    },
    mergePolylines: (state, { payload }) => {
      _.merge(state.polylines, payload);
    },
    setSelectedPolyline: (state, { payload }) => {
      state.selectedMarker = payload;
    },
    setHoveredPolyline: (state, { payload }) => {
      state.hoveredMarker = payload;
    }
  }
})

export const baseSelector = state => state.map;
export const selectState = state => baseSelector(state).state;
export const selectIsState = createSelector(
  selectState,
  (_, value) => value,
  (state, value) => (state === value)
);
export const selectOptions = state => baseSelector(state).options;
export const selectMarkup = state => baseSelector(state).markup;
export const selectSelectedMarkup = state => baseSelector(state).selectedMarkup;
export const selectHoveredMarkup = state => baseSelector(state).hoveredMarkup;
export const selectMarkers = state => baseSelector(state).markers;
export const selectSelectedMarker = state => baseSelector(state).selectedMarker;
export const selectHoveredMarker = state => baseSelector(state).hoveredMarker;
export const selectPolylines = state => baseSelector(state).polylines;
export const selectSelectedPolyline = state => baseSelector(state).selectedPolyline;
export const selectHoveredPolyline = state => baseSelector(state).hoveredPolyline;

export const {
  setState,
  setOptions,
  mergeOptions,
  setMarkup,
  mergeMarkup,
  removeMarkup,
  setSelectedMarkup,
  setHoveredMarkup,
  /* setMarkers, */
  mergeMarkers,
  setSelectedMarker,
  setHoveredMarker,
  setPolylines,
  mergePolylines,
  setSelectedPolyline,
  setHoveredPolyline
} = mapSlice.actions;

export default mapSlice.reducer;
