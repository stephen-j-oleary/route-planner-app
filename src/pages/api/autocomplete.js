import cache from "memory-cache";

import nextConnect from "@/nextConnect";
import httpClient from "@/utils/httpClient";

const URL = process.env.LOOP_AUTOCOMPLETE_URL;
const API_KEY = process.env.LOOP_RAPIDAPI_KEY;
const API_HOST = process.env.LOOP_RAPIDAPI_HOST;
const CACHE_TIME = 5 * 60 * 1000; // 5 mins


const handler = nextConnect();

handler.get(async (req, res) => {
  const { url, query } = req;

  const cached = cache.get(url);
  if (cached) return res.status(200).json(cached);

  const { data } = await httpClient.request({
    method: "get",
    url: URL,
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": API_HOST
    },
    params: query
  });

  cache.put(url, data, CACHE_TIME);
  return res.status(200).json(data);
});

export default handler;