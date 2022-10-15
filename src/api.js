import axios from "axios";
import FormData from "form-data";

const instance = axios.create({
    withCredentials: true,
    baseURL: "https://www.kicktipp.de",
});

function extractCookie(cookieSelector, cookies) {
    const selector = cookieSelector + "=";
    for (const cookie of cookies) {
        if (cookie.includes(selector)) {
            return cookie.substring(selector.length);
        }
    }
}

async function getSessionId() {
    const { headers } = await instance.post(
        "/info/profil/loginaction",
        {},
        { headers: { Cookie: `kurzname=info` } }
    );
    const cookies = headers["set-cookie"].split("; ");
    const sessionId = extractCookie("JSESSIONID", cookies);
    return sessionId;
}

async function login(user, pw, sessionId) {
    const formData = new FormData();
    formData.append("kennung", user);
    formData.append("passwort", pw);

    const { headers, data } = await instance.post(
        "/info/profil/loginaction",
        formData,
        {
            headers: {
                Cookie: `kurzname=info; JSESSIONID=${sessionId};`,
            },
        }
    );

    const cookies = headers["set-cookie"].split("; ");
    const authorizationToken = extractCookie("login", cookies);
    const sameSiteAuthorizationToken = extractCookie(
        "SameSite=None,login",
        cookies
    );

    return { authorizationToken, sameSiteAuthorizationToken, headers };
}

export default { getSessionId, login };
