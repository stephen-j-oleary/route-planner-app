import User from "@/models/User";

export const getAuthSession = jest.fn();
export const getAuthUser = jest.fn().mockResolvedValue(new User());