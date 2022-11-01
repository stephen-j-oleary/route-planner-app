
import axios from "axios";

const URL = process.env.SEARCH_API_URL;
const API_KEY = process.env.RAPID_API_KEY;
const API_HOST = process.env.RAPID_API_HOST;

export default async function handler(req, res) {
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
    return res.status(200).json(response.data);
  }
  catch (err) {
    console.error(err);
    const { response } = err;
    return res.status(response.status || 500).json(response.data);
  }
}
