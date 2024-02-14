const factory = jest.fn().mockReturnValue({
  sendMail: jest.fn().mockResolvedValue({}),
});

export default factory;