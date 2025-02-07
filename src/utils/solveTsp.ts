/** A limit on the size of the matrix */
const MAX_MATRIX_SIZE = 100;
/** Max matrix size for brute force algorithm */
const MAX_BF = 10;
/** Max matrix size for dynamic algorithm */
const MAX_DYNAMIC = 15;


export type Matrix = {
  duration: { value: number },
  distance: { value: number },
}[][];

export type SolveTspOptions = {
  origin?: number,
  destination?: number,
};

/**
 * @param matrix The trip distance matrix to calculate from
 * @param options The trip options to restrict the route to specific conditions
 */
export default function solveTsp(matrix: Matrix, { origin = 0, destination = 0 }: SolveTspOptions = {}) {
  if (!matrix.every((a, _i, arr) => a.length === arr.length)) throw new Error("Matrix must be a square");
  if (matrix.length > MAX_MATRIX_SIZE) throw new Error(`Max locations of ${MAX_MATRIX_SIZE} exceeded`);

  const isRoundTrip = origin === destination;
  const maxBF = MAX_BF + (+!isRoundTrip); // Add one if not round trip
  const maxDynamic = MAX_DYNAMIC + (+!isRoundTrip); // Add one if not round trip
  const matrixSize = matrix.length;
  const durationMatrix = matrix.map(a => a.map(b => b.duration.value));

  let visited: boolean[] = [];
  resetVisited();
  visited[origin] = true;
  /** The current path */
  let currPath: number[] = [];
  currPath[0] = origin;
  /** The current best path */
  let bestPath: number[] = [];
  /** The cost of the best trip */
  let bestTrip = Infinity;
  let improved: boolean = false;
  let costForward: number[] = [];
  let costBackward: number[] = [];

  if (matrixSize <= maxBF) {
    tspBruteForce(origin, 0, 1);
  }
  else if (matrixSize <= maxDynamic) {
    tspDynamic();
  }
  else {
    tspAntColonyK2();
    tspK3();
  }


  /**
   * Resets the array of visited nodes
   */
  function resetVisited() {
    visited = [];
    for (let i = 0; i < matrixSize; ++i) visited[i] = false;
  }

  /**
   * Returns the cost of moving along the current solution path offset
   * given by a to b. Handles moving both forward and backward.
   */
  function cost(a: number, b: number) {
    return (a <= b)
      ? (costForward[b] || 0) - (costForward[a] || 0)
      : (costBackward[b] || 0) - (costBackward[a] || 0);
  }

  /**
   * Returns the cost of the given 3-opt variation of the current solution.
   */
  function costPerm(a: number, b: number, c: number, d: number, e: number, f: number) {
    const A = currPath[a]!;
    const B = currPath[b]!;
    const C = currPath[c]!;
    const D = currPath[d]!;
    const E = currPath[e]!;
    const F = currPath[f]!;
    const g = currPath.length - 1;

    return cost(0, a) + (durationMatrix[A]?.[B] || 0) + cost(b, c) + (durationMatrix[C]?.[D] || 0) + cost(d, e) + (durationMatrix[E]?.[F] || 0) + cost(f, g);
  }

  /**
   * Update the datastructures necessary for cost(a,b) and costPerm to work
   * efficiently.
   */
  function updateCosts() {
    costForward = new Array(currPath.length);
    costBackward = new Array(currPath.length);

    costForward[0] = 0.0;
    for (let i = 1; i < currPath.length; ++i) {
      costForward[i] = (costForward[i - 1] || 0) + (durationMatrix[currPath[i - 1]!]?.[currPath[i]!] || 0);
    }
    bestTrip = costForward[currPath.length - 1]!;

    costBackward[currPath.length - 1] = 0.0;
    for (let i = currPath.length - 2; i >= 0; --i) {
      costBackward[i] = (costBackward[i + 1] || 0) + (durationMatrix[currPath[i + 1]!]?.[currPath[i]!] || 0);
    }
  }

  /**
   * Update the current solution with the given 3-opt move.
   */
  function updatePerm(a: number, b: number, c: number, d: number, e: number, f: number) {
    improved = true;
    const nextPath = new Array(currPath.length);
    for (let i = 0; i < currPath.length; ++i) nextPath[i] = currPath[i];
    let offset = a + 1;
    nextPath[offset++] = currPath[b];
    if (b < c) {
      for (let i = b + 1; i <= c; ++i) {
        nextPath[offset++] = currPath[i];
      }
    } else {
      for (let i = b - 1; i >= c; --i) {
        nextPath[offset++] = currPath[i];
      }
    }
    nextPath[offset++] = currPath[d];
    if (d < e) {
      for (let i = d + 1; i <= e; ++i) {
        nextPath[offset++] = currPath[i];
      }
    } else {
      for (let i = d - 1; i >= e; --i) {
        nextPath[offset++] = currPath[i];
      }
    }
    nextPath[offset++] = currPath[f];
    currPath = nextPath;

    updateCosts();
  }

  /**
   * Uses the 3-opt algorithm to find a good solution to the TSP.
   */
  function tspK3() {
    currPath = new Array(bestPath.length);
    for (let i = 0; i < bestPath.length; ++i) currPath[i] = bestPath[i]!;

    updateCosts();
    improved = true;
    while (improved) {
      improved = false;
      for (let i = 0; i < currPath.length - 3; ++i) {
        for (let j = i + 1; j < currPath.length - 2; ++j) {
          for (let k = j + 1; k < currPath.length - 1; ++k) {
            if (costPerm(i, i + 1, j, k, j + 1, k + 1) < bestTrip)
              updatePerm(i, i + 1, j, k, j + 1, k + 1);
            if (costPerm(i, j, i + 1, j + 1, k, k + 1) < bestTrip)
              updatePerm(i, j, i + 1, j + 1, k, k + 1);
            if (costPerm(i, j, i + 1, k, j + 1, k + 1) < bestTrip)
              updatePerm(i, j, i + 1, k, j + 1, k + 1);
            if (costPerm(i, j + 1, k, i + 1, j, k + 1) < bestTrip)
              updatePerm(i, j + 1, k, i + 1, j, k + 1);
            if (costPerm(i, j + 1, k, j, i + 1, k + 1) < bestTrip)
              updatePerm(i, j + 1, k, j, i + 1, k + 1);
            if (costPerm(i, k, j + 1, i + 1, j, k + 1) < bestTrip)
              updatePerm(i, k, j + 1, i + 1, j, k + 1);
            if (costPerm(i, k, j + 1, j, i + 1, k + 1) < bestTrip)
              updatePerm(i, k, j + 1, j, i + 1, k + 1);
          }
        }
      }
    }
    for (let i = 0; i < bestPath.length; ++i) bestPath[i] = currPath[i]!;
  }

  /**
   * Computes a near-optimal solution to the TSP problem,
   * using Ant Colony Optimization and local optimization
   * in the form of k2-opting each candidate route.
   * Run time is O(numWaves * numAnts * numActive ^ 2) for ACO
   * and O(numWaves * numAnts * numActive ^ 3) for rewiring?
   *
   * if mode is 1, we start at node 0 and end at node numActive-1.
   */
  function tspAntColonyK2() {
    /** The importance of the previous trails */
    const ALPHA = 0.1;
    /** The importance of the durations */
    const BETA = 2.0;
    /** The decay rate of the pheromone trails */
    const RHO = 0.1;
    /** The sharpness of the reward as the solutions approach the best solution */
    const ASYMPTOTE_FACTOR = 0.9;
    /** The number of waves to go through */
    const NUM_WAVES = 20;
    /** The number of ant per wave */
    const NUM_ANTS = 20;

    const pher: number[][] = [];
    const nextPher: number[][] = [];
    const prob = [];

    // Create a pheromone table with default values
    for (let i = 0; i < matrixSize; ++i) {
      pher[i] = [];
      nextPher[i] = [];

      for (let j = 0; j < matrixSize; ++j) {
        pher[i]![j] = 1;
        nextPher[i]![j] = 0.0;
      }
    }

    const numSteps = matrixSize - (isRoundTrip ? 1 : 2);
    const numValidDests = isRoundTrip ? matrixSize : matrixSize - 1;

    for (let wave = 0; wave < NUM_WAVES; ++wave) {
      for (let ant = 0; ant < NUM_ANTS; ++ant) {
        let curr = origin;
        let currDist = 0;
        resetVisited();

        currPath[0] = curr;
        for (let step = 0; step < numSteps; ++step) {
          visited[curr] = true;
          let cumProb = 0.0;
          for (let next = 1; next < numValidDests; ++next) {
            if (!visited[next]) {
              prob[next] = Math.pow(pher[curr]?.[next] || 0, ALPHA) *
                Math.pow(durationMatrix[curr]?.[next] || 0, 0.0 - BETA);
              cumProb += prob[next] || 0;
            }
          }

          let guess = Math.random() * cumProb;
          let nextI = -1;
          for (let next = 1; next < numValidDests; ++next) {
            if (!visited[next]) {
              nextI = next;
              guess -= prob[next] || 0;
              if (guess < 0) {
                nextI = next;
                break;
              }
            }
          }

          currDist += durationMatrix[curr]?.[nextI] || 0;
          currPath[step + 1] = nextI;
          curr = nextI;
        }

        currPath[numSteps + 1] = destination;
        currDist += durationMatrix[curr]?.[destination] || 0;

        // k2-rewire:
        const lastStep = isRoundTrip ? matrixSize : matrixSize - 1;

        let changed = true;
        let i = 0;
        while (changed) {
          changed = false;
          for (; i < lastStep - 2 && !changed; ++i) {
            let cost = durationMatrix[currPath[i + 1]!]?.[currPath[i + 2]!] || 0;
            let revCost = durationMatrix[currPath[i + 2]!]?.[currPath[i + 1]!] || 0;
            const iCost = durationMatrix[currPath[i]!]?.[currPath[i + 1]!] || 0;
            let tmp, nowCost, newCost;
            for (let j = i + 2; j < lastStep && !changed; ++j) {
              nowCost = cost + iCost + (durationMatrix[currPath[j]!]?.[currPath[j + 1]!] || 0);
              newCost = revCost + (durationMatrix[currPath[i]!]?.[currPath[j]!] || 0)
                + (durationMatrix[currPath[i + 1]!]?.[currPath[j + 1]!] || 0);
              if (nowCost > newCost) {
                currDist += newCost - nowCost;
                // Reverse the detached road segment.
                for (let k = 0; k < Math.floor((j - i) / 2); ++k) {
                  tmp = currPath[i + 1 + k];
                  currPath[i + 1 + k] = currPath[j - k]!;
                  currPath[j - k] = tmp!;
                }
                changed = true;
                --i;
              }
              cost += durationMatrix[currPath[j]!]?.[currPath[j + 1]!] || 0;
              revCost += durationMatrix[currPath[j + 1]!]?.[currPath[j]!] || 0;
            }
          }
        }

        if (currDist < bestTrip) {
          bestPath = currPath;
          bestTrip = currDist;
        }
        for (let i = 0; i <= numSteps; ++i) {
          nextPher[currPath[i]!]![currPath[i + 1]!] += (bestTrip - ASYMPTOTE_FACTOR * bestTrip) / (NUM_ANTS * (currDist - ASYMPTOTE_FACTOR * bestTrip));
        }
      }

      // Decay the pheromones and reset nextPher for the next wave
      for (let i = 0; i < matrixSize; ++i) {
        for (let j = 0; j < matrixSize; ++j) {
          pher[i]![j] = (pher[i]?.[j] || 1) * (1.0 - RHO) + RHO * (nextPher[i]?.[j] || 1);
          nextPher[i]![j] = 0.0;
        }
      }
    }
  }

  /**
   * Returns the optimal solution to the TSP problem.
   * Run-time is O((matrixSize - 1)!).
   * Prerequisites:
   * - this.matrixSize contains the number of locations
   * - this.durationMatrix[i][j] contains weight of edge from node i to node j
   * - this.visited[i] should be false for all nodes
   * - this.bestTrip is set to a very high number
   *
   * If mode is 1, it will return the optimal solution to the related
   * problem of finding a path from node 0 to node matrixSize - 1, visiting
   * the in-between nodes in the best order.
   */
  function tspBruteForce(currNode: number, currLen: number, currStep: number) {
    // Set mode parameters:
    const numSteps = matrixSize - (isRoundTrip ? 0 : 1);

    // Check if this route is not promising:
    if (currLen + (durationMatrix[currNode]?.[destination] || 0) >= bestTrip) return;

    // If this is the last node:
    if (currStep === numSteps) {
      currLen += durationMatrix[currNode]?.[destination] || 0;
      currPath[currStep] = destination;
      bestTrip = currLen;
      for (let i = 0; i <= numSteps; ++i) bestPath[i] = currPath[i]!;
    }
    else {
      // Try all possible routes:
      for (let i = 0; i <= numSteps; ++i) {
        if (i === origin || i === destination || visited[i]) continue;

        visited[i] = true;
        currPath[currStep] = i;
        tspBruteForce(i, currLen + (durationMatrix[currNode]?.[i] || 0), currStep + 1);
        visited[i] = false;
      }
    }
  }

  function _combinations(set: number, at: number, len: number, subsets: number[]) {
    if (len === 0) {
      subsets.push(set);
      return;
    }

    for (let i = at; i < matrixSize; i++) {
      // Turn on "i"th bit
      set = set | (1 << i);

      // Recursively loop through the remaining bits with the "i"th bit turned on
      _combinations(set, i + 1, len - 1, subsets);

      // Turn off "i"th bit
      set = set & ~(1 << i);
    }
  }

  function combinations(len: number) {
    const subsets: number[] = [];
    _combinations(0, 0, len, subsets);
    return subsets;
  }

  function notIn(i: number, subset: number) {
    return ((1 << i) & subset) === 0;
  }

  /**
   * Solves the TSP problem to optimality. Memory requirement is
   * O(numActive * 2^numActive)
   */
  function tspDynamic() {
    // Initialize the memo table
    const memo: number[][] = Array(1 << matrixSize).fill(0).map(() => (
      Array(matrixSize).fill(Infinity)
    ));

    // Setup memo table
    for (let k = 0; k < matrixSize; k++) {
      // Make sure to skip (k === origin) because this route cannot exist
      if (k === origin) continue;

      // Fill values for direct routes from "origin" to "k"
      const index = (1 << origin) | (1 << k);
      memo[index][k] = durationMatrix[origin][k];
    }

    // Loop through subset sizes (s = number of stops in the subset)
    // Fill the memo table with partial routes
    for (let s = 3; s <= matrixSize; ++s) {
      for (const subset of combinations(s)) {
        if (notIn(origin, subset)) continue;

        for (let next = 0; next < matrixSize; next++) {
          if (next === origin || notIn(next, subset)) continue;

          const prevIndex = subset ^ (1 << next);
          memo[subset][next] = Infinity;

          for (let end = 0; end < matrixSize; end++) {
            if (end === origin || end === next || notIn(end, subset)) continue;

            const newCost = memo[prevIndex][end] + durationMatrix[end][next];

            if (newCost < memo[subset][next])
              memo[subset][next] = newCost;
          }
        }
      }
    }

    let lastIndex = destination;
    let state = (1 << matrixSize) - 1; // All stops visited

    for (let i = 0; i < matrixSize; ++i) {
      bestPath[i] = 0;
    }

    for (let i = matrixSize - 1; i >= 1; i--) {
      let index = -1;

      for (let j = 0; j < matrixSize; j++) {
        if (j === origin || notIn(j, state)) continue;

        if (index === -1) index = j;

        const prevCost = memo[state][index] + durationMatrix[index][lastIndex];
        const newCost = memo[state][j] + durationMatrix[j][lastIndex];
        if (newCost < prevCost) index = j;
      }

      bestPath[i] = index;
      state = state ^ (1 << index);
      lastIndex = index;
    }

    bestPath[0] = origin;
    if (destination === origin) bestPath[matrixSize] = destination;
  }

  return {
    matrix,
    stopOrder: bestPath,
  };
}