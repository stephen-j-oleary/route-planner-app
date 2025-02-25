declare global {
  interface Window {
    dataLayer: unknown[],
  }
}


export function sendGTMEvent(..._args: unknown[]) {
  window.dataLayer ??= [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}