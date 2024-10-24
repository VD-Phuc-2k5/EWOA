import { poolingMechanism } from "./poolingMechanism.js";
import { randIndex } from "./randIndex.js";

function fobj(whale) {
  return whale.reduce(
    (sum, val) => sum - val * Math.sin(Math.sqrt(Math.abs(val))),
    0
  );
}

export class EWOA {
  constructor(searchAgentsNo, maxIter, problemSize, lb, ub) {
    this.searchAgentsNo = searchAgentsNo;
    this.maxIter = maxIter;
    this.problemSize = problemSize;
    this.lb = lb;
    this.ub = ub;
    this.populations = this.initialization();
    this.fitness = this.evaluateFitness(this.populations);
    this.bestSol = this.populations[this.getBestIndex()];
    this.bestScore = this.fitness[this.getBestIndex()];
    this.convergence = [];
    this.pool = this.initializePool();
    this.portionRate = 5;
  }

  boundConstraint(whale) {
    return whale.map((val) => Math.max(this.lb, Math.min(val, this.ub)));
  }

  initialization() {
    return Array.from({ length: this.searchAgentsNo }, () =>
      Array.from(
        { length: this.problemSize },
        () => Math.random() * (this.ub - this.lb) + this.lb
      )
    );
  }

  evaluateFitness(populations) {
    return populations.map((whale) => fobj(whale));
  }

  getBestIndex() {
    return this.fitness.indexOf(Math.min(...this.fitness));
  }

  getRandomIndices(max, count) {
    const indices = new Set();
    while (indices.size < count) {
      indices.add(Math.floor(Math.random() * max));
    }
    return Array.from(indices);
  }

  initializePool() {
    return {
      kappa: 1.5 * this.searchAgentsNo,
      position: [],
    };
  }

  optimize() {
    let t = 0;
    while (t < this.maxIter) {
      const I = this.fitness.map((value) => value > this.bestScore);
      const Ind = I.map((value, index) => (value ? index : -1)).filter(
        (index) => index !== -1
      );
      const X_worst = Ind.map((index) => this.populations[index]);
      this.pool = poolingMechanism(this.pool, X_worst, this.bestSol);
      const a = -1 + t * (-1 / this.maxIter);
      const P_portion = this.getRandomIndices(
        this.searchAgentsNo,
        this.portionRate
      );
      const popPool = this.pool.position;
      const [P_rnd1, P_rnd2] = randIndex(popPool.length, this.searchAgentsNo);

      const p = Array.from({ length: this.searchAgentsNo }, () =>
        Math.random()
      );
      let A = Array.from({ length: this.searchAgentsNo }, () =>
        Math.max(
          0,
          Math.min(0.5 + 0.1 * Math.tan(Math.PI * (Math.random() - 0.5)), 1)
        )
      );

      this.populations = this.populations.map((whale, i) => {
        if (!P_portion.includes(i)) {
          const C = 2 * Math.random();
          return whale.map((_, j) => {
            const l = (a - 1) * Math.random() + 1;
            if (p[i] < 0.5) {
              if (A[i] < 0.5) {
                const rand_leader_idx = Math.floor(
                  popPool.length * Math.random()
                );
                const Prdn3 = popPool[rand_leader_idx][j];
                const D_prim = Math.abs(C * this.bestSol[j] - Prdn3);
                return this.bestSol[j] - A[i] * D_prim;
              } else {
                return (
                  this.populations[i][j] +
                  A[i] * (C * popPool[P_rnd1[i]][j] - popPool[P_rnd2[i]][j])
                );
              }
            } else {
              const D_prim = Math.abs(this.bestSol[j] - this.populations[i][j]);
              return (
                D_prim * Math.exp(l) * Math.cos(2 * Math.PI * l) +
                this.bestSol[j]
              );
            }
          });
        }
        return whale;
      });

      const bestMax = Math.max(...this.bestSol);
      const bestMin = Math.min(...this.bestSol);
      const X_rnd = Array.from({ length: P_portion.length }, () =>
        Array.from(
          { length: this.problemSize },
          () => Math.random() * (this.ub - this.lb) + this.lb
        )
      );
      const X_brnd = Array.from({ length: P_portion.length }, () =>
        Array.from(
          { length: this.problemSize },
          () => Math.random() * (bestMax - bestMin) + bestMin
        )
      );

      P_portion.forEach((rowIndex, i) => {
        this.populations[rowIndex] = X_rnd[i].map(
          (value, j) => value - X_brnd[i][j]
        );
      });

      this.populations = this.populations.map((whale) =>
        this.boundConstraint(whale)
      );

      this.fitness = this.evaluateFitness(this.populations);
      const fit = Math.min(...this.fitness);
      const bestIndex = this.getBestIndex();

      if (fit < this.bestScore) {
        this.bestSol = this.populations[bestIndex];
        this.bestScore = fit;
      }

      this.convergence.push(this.bestScore);
      t++;
    }
  }
}
