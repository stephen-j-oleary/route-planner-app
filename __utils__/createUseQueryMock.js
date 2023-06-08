/**
 * Returns a mock instance of useQuery that will hold the given status, error and data
 * @param {*} state The mocked state of the mutation
 * @returns {import("react-query").UseQueryResult}
 */
export default function createUseQueryMock({ status, error, data } = {}) {
  return ({
    select = v => v,
  } = {}) => ({
    status,
    error,
    data: select(data),
    isLoading: status === "loading",
    isError: status === "error",
    isSuccess: status === "success",
  });
}