import api from "./src/api.js";
import dotenv from "dotenv";
dotenv.config();

const user = process.env["USERNAME"];
const pw = process.env["PW"];

let { sessionId, cookies } = await api.getSessionId();
console.log("Session ID");
console.log(sessionId);
console.log(cookies);
let {
    authorizationToken,
    sameSiteAuthorizationToken,
    cookies: c,
} = await api.login(user, pw, sessionId);
console.log("Login");
console.log(authorizationToken + ".", sameSiteAuthorizationToken + ".");
console.log(c);
let profil = await api.profil(authorizationToken, sessionId);
console.log("Profil");
console.log(profil);
