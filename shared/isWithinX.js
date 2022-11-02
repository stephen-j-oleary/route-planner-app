
export default function isWithinX(num, test, diff) {
  return (Math.abs(test - num) < diff);
}
