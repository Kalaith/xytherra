﻿export type RandomNumberGenerator = () => number;

/**
 * Mulberry32 pseudo-random number generator.
 * Deterministic and fast enough for gameplay generation use cases.
 */
export const createRandomNumberGenerator = (seed: number): RandomNumberGenerator => {
  let internalState = seed >>> 0;
  return () => {
    internalState += 0x6d2b79f5;
    let scrambledState = internalState;
    scrambledState = Math.imul(scrambledState ^ (scrambledState >>> 15), scrambledState | 1);
    scrambledState ^=
      scrambledState +
      Math.imul(scrambledState ^ (scrambledState >>> 7), scrambledState | 61);
    return ((scrambledState ^ (scrambledState >>> 14)) >>> 0) / 4294967296;
  };
};

export const generateRandomInteger = (
  randomNumberGenerator: RandomNumberGenerator,
  maxExclusive: number,
  minInclusive = 0,
): number => {
  if (maxExclusive <= minInclusive) {
    return minInclusive;
  }
  const rangeSpan = maxExclusive - minInclusive;
  return Math.floor(randomNumberGenerator() * rangeSpan) + minInclusive;
};

export const selectRandomElement = <T>(
  randomNumberGenerator: RandomNumberGenerator,
  list: readonly T[],
): T => {
  if (list.length === 0) {
    throw new Error('Cannot pick from an empty list');
  }
  const index = generateRandomInteger(randomNumberGenerator, list.length);
  return list[index];
};
