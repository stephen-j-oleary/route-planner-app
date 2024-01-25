import { shuffle } from "lodash";

import solveTsp from "../solveTsp";


const generateMatrix = (size: number, { weight = 1, expectRoundTrip = true } = {}) => {
  const expectedPath = [0]; // Each path starts at the first index
  expectedPath.push(...shuffle(Array(size - (expectRoundTrip ? 1 : 2)).fill(0).map((_v, i) => i + 1))); // Generate a random order of stops
  if (!expectRoundTrip) expectedPath.push(size - 1); // Make sure the path is expected to end on the last index

  // Create a matrix with a predictable shortest path through it
  const matrix = createMatrix(
    Array(size).fill(0).map((_a, i) => (
      Array(size).fill(0).map((_b, j) => (
        j === i
          ? 0
          : j === (expectedPath[expectedPath.indexOf(i) + 1] ?? expectedPath[0])
          ? 1
          : 1 + weight
      ))
    ))
  );

  if (expectRoundTrip) expectedPath.push(0); // Expect the path to loop back to the first index

  return {
    expectedPath,
    matrix,
  };
};
const createMatrix = (m: number[][]) => m.map(a => a.map(b => createDistance(b)));
const createDistance = (dur: number = 0, dis: number = dur) => ({
  duration: { value: dur },
  distance: { value: dis },
});

describe("solveTsp", () => {
  it("should not accept a non-square matrix", () => {
    const call = () => solveTsp(createMatrix([
      [1],
      [1],
    ]));

    expect(call).toThrow(/must be a square/i);
  })

  it("should not accept over 100 stops", () => {
    const call = () => solveTsp(generateMatrix(101).matrix);

    expect(call).toThrow(/max locations/i);
  })

  it("should have the correct response format", () => {
    const matrix = createMatrix([
      [0, 1],
      [1, 0],
    ]);
    const result = solveTsp(matrix);

    expect(result).toHaveProperty("matrix", matrix);
    expect(result).toHaveProperty("stopOrder", expect.any(Array));
  })

  it("should find the correct roundtrip through a small distance matrix", () => {
    const matrix = createMatrix([
      [0, 1, 2, 2],
      [2, 0, 2, 1],
      [1, 2, 0, 2],
      [2, 2, 1, 0],
    ]);
    const result = solveTsp(matrix);

    expect(result.stopOrder).toEqual([0, 1, 3, 2, 0]);
  })

  it("should find the correct roundtrip through a large distance matrix", () => {
    const { matrix, expectedPath } = generateMatrix(100);
    const result = solveTsp(matrix);

    expect(result.stopOrder).toEqual(expectedPath);
  })

  it("should find the correct a-to-z through a small distance matrix", () => {
    const matrix = createMatrix([
      [0, 2, 1, 2],
      [2, 0, 2, 1],
      [2, 1, 0, 2],
      [1, 2, 2, 0],
    ]);
    const result = solveTsp(matrix, { isRoundTrip: false });

    expect(result.stopOrder).toEqual([0, 2, 1, 3]);
  })

  it("should find the correct a-to-z through a large distance matrix", () => {
    const { matrix, expectedPath } = generateMatrix(100, { expectRoundTrip: false });
    const result = solveTsp(matrix, { isRoundTrip: false });

    expect(result.stopOrder).toEqual(expectedPath);
  })
})