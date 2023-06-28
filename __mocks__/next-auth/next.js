export const getServerSession = jest.fn().mockResolvedValue({
  user: {
    customerId: "customer_id",
  },
});