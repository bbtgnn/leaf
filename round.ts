export default function round(n: number, d: number): number {
  const power = Math.pow(10, d);
  return Math.round((n + Number.EPSILON) * power) / power;
}
