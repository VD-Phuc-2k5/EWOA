export function randIndex(NP1, SearchAgents_no) {
  const rnd0 = Array.from({ length: SearchAgents_no }, (_, i) => i + 1);
  const NP0 = rnd0.length;
  const getRandomIndex = () => Math.floor(Math.random() * NP1);

  let rnd1 = new Array(NP0);

  for (let i = 0; i < NP0; i++) {
    let randNum;
    do {
      randNum = getRandomIndex();
    } while (randNum === rnd0[i]);
    rnd1[i] = randNum;
  }

  let rnd2 = new Array(NP0);

  for (let i = 0; i < NP0; i++) {
    let randNum;
    do {
      randNum = getRandomIndex();
    } while (randNum === rnd0[i] || randNum === rnd1[i]);
    rnd2[i] = randNum;
  }

  return [rnd1, rnd2];
}
