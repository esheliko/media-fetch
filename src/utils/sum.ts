export default (array: number[], initial: number = 0) =>
  array.reduce((prev, curr) => prev + curr, initial);
