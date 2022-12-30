import axios from "axios";

//const BASE_URL = "http://localhost:3000";

const BASE_URL = process.env.VERCEL_URL as string;

export default axios.create({ baseURL: BASE_URL });
