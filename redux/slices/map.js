
import { createSlice } from "@reduxjs/toolkit";

export const DEFAULT_CENTER = "51.0447,-114.0719";
export const DEFAULT_ZOOM = 7;
export const MAP_TYPES = {
  placeholder: "placeholder",
  embed: "embed",
  interactive: "interactive"
}
export const MAP_MODES = {
  place: "place",
  view: "view",
  directions: "directions",
  search: "search"
}
export const DEFAULT_EMBED_OPTIONS = {
  mode: MAP_MODES.view,
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
  maptype: "roadmap"
}
export const DEFAULT_INTERACTIVE_OPTIONS = {
  center: {
    lat: 51.0447,
    lng: -114.0719
  },
  zoom: 13,
  mapTypeControl: false,
  fullscreenControl: false
}
export const DEFAULT_SEARCH = {
  bounds: {
    north: 51.5447,
    south: 50.5447,
    east: -113.5719,
    west: -114.5719
  },
  fields: [
    "formatted_address",
    "geometry",
    "name"
  ],
  strictBounds: false,
  types: [
    "address"
  ]
}
export const DEFAULT_MARKERS = []

const initialState = {
  type: MAP_TYPES.placeholder,
  options: DEFAULT_EMBED_OPTIONS,
  search: DEFAULT_SEARCH,
  markers: DEFAULT_MARKERS
}

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setPlaceholder: state => {
      state.type = MAP_TYPES.placeholder;
    },
    setEmbed: (state, { payload }) => {
      state.type = MAP_TYPES.embed;
      state.options = {
        ...DEFAULT_EMBED_OPTIONS,
        ...payload
      };
    },
    setType: (state, { payload }) => {
      state.type = payload;
    },
    setOptions: (state, { payload }) => {
      state.options = payload;
    },
    setMode: (state, { payload }) => {
      state.options.mode = payload;
    },
    setCenter: (state, { payload }) => {
      state.options.center = payload;
    },
    setZoom: (state, { payload }) => {
      state.options.zoom = payload;
    },
    setHeading: (state, { payload }) => {
      state.options.heading = payload;
    },
    setSearch: (state, { payload }) => {
      state.search = payload;
    },
    setBounds: (state, { payload }) => {
      state.search.bounds = payload;
    },
    setMarkers: (state, { payload }) => {
      state.markers = payload;
    },
    clearMarkers: state => {
      state.markers = [];
    },
    pushMarker: (state, { payload }) => {
      state.markers.push(payload);
    },
    removeMarker: (state, { payload }) => {
      state.markers.splice(payload, 1);
    }
  }
})

export const actions = mapSlice.actions;

export default mapSlice.reducer;
