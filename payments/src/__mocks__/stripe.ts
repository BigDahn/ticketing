import { jest } from '@jest/globals';

export const stripe = {
  charges: {
    create: jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: 'test_charge_id' })),
    list: jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: [{ id: 'test_charge_id', amount: 2000, currency: 'usd' }],
      }),
    ),
  },
};
