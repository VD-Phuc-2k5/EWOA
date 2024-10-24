// Function to combine matrices B, X_brnd, and X_worst
function combineMatrices(B, X_brnd, X_worst) {
  const numRows = B.length;
  const numCols = B[0].length;
  const P = Array.from({ length: numRows }, () => Array(numCols).fill(0));

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      P[i][j] = B[i][j] * X_brnd[i][j] + (1 - B[i][j]) * X_worst[i][j];
    }
  }

  return P;
}

// Helper function to ensure unique rows
function uniqueRows(matrix) {
  const seen = new Set();
  return matrix.filter((row) => {
    const key = row.join(",");
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Main pooling mechanism function
export function poolingMechanism(Pool, X_worst, X_best) {
  const bestMax = Math.max(...X_best);
  const bestMin = Math.min(...X_best);
  const numRows = X_worst.length;
  const numCols = X_worst[0].length;

  // Generate random binary matrix B and random matrix X_brnd
  const B = Array.from({ length: numRows }, () =>
    Array.from({ length: numCols }, () => Math.round(Math.random()))
  );

  const X_brnd = Array.from({ length: numRows }, () =>
    Array.from(
      { length: numCols },
      () => Math.random() * (bestMax - bestMin) + bestMin
    )
  );

  // Compute P using combineMatrices function
  const P = combineMatrices(B, X_brnd, X_worst);

  // Unique rows of P
  const uniqueP = uniqueRows(P);

  const PoolCrntSize = Pool.position.length;
  const FreeSpace = Pool.kappa - PoolCrntSize;

  if (FreeSpace > 0) {
    if (uniqueP.length <= FreeSpace) {
      Pool.position = uniqueRows(Pool.position.concat(uniqueP));
    } else {
      const toAdd = uniqueP.slice(0, FreeSpace);
      Pool.position = uniqueRows(Pool.position.concat(toAdd));

      // Ensure we are not exceeding the Pool.kappa size
      const Rm = uniqueP.length - FreeSpace;
      const indicesToReplace = Array.from({ length: Rm }, () =>
        Math.floor(Math.random() * PoolCrntSize)
      );

      indicesToReplace.forEach((index, i) => {
        Pool.position[index] = uniqueP[FreeSpace + i];
      });
    }
  } else {
    const indicesToReplace = Array.from({ length: uniqueP.length }, () =>
      Math.floor(Math.random() * PoolCrntSize)
    );

    indicesToReplace.forEach((index, i) => {
      Pool.position[index] = uniqueP[i];
    });
  }

  // Ensure Pool.position has unique rows
  Pool.position = uniqueRows(Pool.position);

  return Pool;
}
