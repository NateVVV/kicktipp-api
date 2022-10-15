import api from "./src/api.js";
import dotenv from "dotenv";
dotenv.config();

const user = process.env["USERNAME"];
const pw = process.env["PW"];

let sessionId = await api.getSessionId();
console.log(sessionId);
let login = await api.login(user, pw, sessionId);
console.log(login);
