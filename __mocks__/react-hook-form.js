import createUseFormMock from "__utils__/createUseFormMock";

export * from "react-hook-form";

export const useForm = jest.fn().mockImplementation(
  createUseFormMock({
    optionReplacements: {
      mode: "all",
    },
  })
);