export const useSession = jest.fn().mockReturnValue({
  status: "authenticated",
  data: {},
});

export const getProviders = jest.fn(async () => ({}));

export const signIn = jest.fn().mockResolvedValue({
  ok: true,
  error: null,
});

export const signOut = jest.fn();