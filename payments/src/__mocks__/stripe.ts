export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({
      id: 'test_charge_id',
    }),
    list: jest.fn().mockResolvedValue({
      data: [
        {
          id: 'test_charge_id',
          amount: 2000,
          currency: 'usd',
        },
      ],
    }),
  },
};
