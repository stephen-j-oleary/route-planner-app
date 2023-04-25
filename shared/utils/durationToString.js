import moment from "moment";


export default function durationToString(duration) {
  const _duration = moment.duration(duration, "seconds");
  const days = _duration.days();
  const hours = _duration.hours();
  const minutes = _duration.minutes();

  return [
    days ? `${days} days` : undefined,
    hours ? `${hours} hours` : undefined,
    minutes ? `${minutes} mins` : undefined,
  ].join(" ").trim();
}