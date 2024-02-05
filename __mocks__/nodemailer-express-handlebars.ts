const factory = jest.fn().mockReturnValue((_: unknown, cb: () => void) => cb());

export default factory;