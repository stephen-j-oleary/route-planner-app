
import axios from "axios";
import cache from "memory-cache";

const URL = process.env.AUTOCOMPLETE_API_URL;
const API_KEY = process.env.RAPID_API_KEY;
const API_HOST = process.env.RAPID_API_HOST;
const CACHE_TIME = 5 * 60 * 1000; // 5 mins

export default async function handler(req, res) {
  const value = cache.get(req.url);
  if (value) return res.status(200).json(value);

  const config = {
    method: "get",
    url: URL,
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": API_HOST
    },
    params: req.query
  };

  try {
    const response = await axios.request(config);
    cache.put(req.url, response.data, CACHE_TIME);
    return res.status(200).json(response.data);
  }
  catch (err) {
    console.error(err);
    const { response } = err;
    return res.status(response?.status || 500).json(response?.data || err.message);
  }
}
