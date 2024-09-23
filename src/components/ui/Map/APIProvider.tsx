// APIProvider uses React Context and needs to be marked as a client component
// Don't directly import from the library in a server component
"use client";

import { APIProvider } from "@vis.gl/react-google-maps";

export default APIProvider;