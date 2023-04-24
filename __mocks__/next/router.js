export const useRouter = jest.fn().mockReturnValue({
  isReady: true,
  pathname: "/",
  push: jest.fn(),
});