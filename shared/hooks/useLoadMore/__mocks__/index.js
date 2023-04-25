export default jest.fn(
  function useLoadMore() {
    return {
      current: 3,
      visible: [{ id: 1 }, { id: 2 }, { id: 3 }],
      hasMore: true,
      increment: jest.fn(),
      decrement: jest.fn(),
      reset: jest.fn(),
      IncrementButton: () => <button>Increment</button>,
      DecrementButton: () => <button>Decrement</button>,
      ResetButton: () => <button>Reset</button>,
    };
  }
);