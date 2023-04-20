export default function useAddressSuggestions() {
  return {
    quickSuggestions: [{
      id: "id",
      value: "value",
      getValue: () => "value",
      getProps: () => {},
    }],
    listSuggestions: [{
      id: "id",
      value: "value",
      getValue: () => "value",
      getProps: () => {},
    }],
  };
}