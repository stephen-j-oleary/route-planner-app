export const stripeApiClient = {
  subscriptions: {
    list: jest.fn().mockResolvedValue({
      data: [{
        items: {
          data: [{
            id: "subscription_item_id",
          }],
        },
      }],
    }),
  },
};