export * from "react-query";


export const useQueryClient = jest.fn().mockReturnValue({
  invalidateQueries: jest.fn(),
});