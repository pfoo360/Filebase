import axios from "axios";

const BASE_URL = "https://filebase-kp0xe7r7q-pfoo360.vercel.app";

export default axios.create({ baseURL: BASE_URL });
