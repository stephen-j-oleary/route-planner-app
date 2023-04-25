const localStorageClient = (typeof window !== "undefined" && !!window.localStorage)
  ? window.localStorage
  : null;

export default localStorageClient;