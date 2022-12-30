import axios from "axios";

const BASE_URL = (process.env.VERCEL_URL ?? "http://localhost:3000") as string;

export default axios.create({ baseURL: BASE_URL });
