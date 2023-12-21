const FORMAT_WITH_YEAR = "MMM D, YYYY";
const FORMAT_WITHOUT_YEAR = "MMM D";


export default function formatDateRange(startMoment, endMoment) {
  const isSameYear = startMoment.year() === endMoment.year();
  const startString = startMoment.format(isSameYear ? FORMAT_WITHOUT_YEAR : FORMAT_WITH_YEAR);
  const endString = endMoment.format(FORMAT_WITH_YEAR);

  return `${startString} - ${endString}`;
}