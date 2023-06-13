export const useSession = jest.fn(() => ({
  status: "authenticated",
  data: {},
}));

export const getProviders = jest.fn(async () => ({}));

export const signIn = jest.fn();

export const signOut = jest.fn();