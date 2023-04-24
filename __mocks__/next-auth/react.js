export const useSession = jest.fn(() => ({
  status: "authenticated",
  data: {},
}));

export const signOut = jest.fn();