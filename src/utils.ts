// Hash a number
const OFFSET_BASIS_32 = 2166136261
export const fnv1a = (string: String): number => {
  let hash = OFFSET_BASIS_32

  for (let i = 0; i < string.length; i++) {
    hash ^= string.charCodeAt(i)

    // 32-bit FNV prime: 2**24 + 2**8 + 0x93 = 16777619
    // Using bitshift for accuracy and performance. Numbers in JS suck.
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)
  }

  return hash >>> 0
}

// Range: n is a number between 0 and 1
// Will create an integer that mimics the range of n
export const range = (lower: number, upper: number) => (n: number): number =>
  Math.floor(n * (upper - lower + 1)) + lower
