const navigatorClient = (typeof window !== "undefined" && !!window.navigator)
  ? window.navigator
  : null;

export default navigatorClient;