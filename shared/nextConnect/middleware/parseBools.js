export default function parseBools(req, _res, next) {
  for (const key in req.query) {
    const value = req.query[key];
    if (value === "true") req.query[key] = true;
    if (value === "false") req.query[key] = false;
  }

  next();
}