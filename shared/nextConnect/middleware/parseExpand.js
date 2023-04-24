export default function parseExpand(req, _res, next) {
  const { query, body } = req;
  if (query.expand) req.query.expand = query.expand.split(",");
  if (body.expand) req.body.expand = body.expand.split(",");

  next();
}