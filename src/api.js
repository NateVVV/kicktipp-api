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
            const pos = cookie.indexOf(selector);
            return cookie.substring(pos + selector.length);
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
    return { sessionId, cookies };
}

async function login(user, pw, sessionId) {
    const formData = new FormData();
    formData.append("kennung", user);
    formData.append("passwort", pw);

    let res = await instance.post("/info/profil/loginaction", formData, {
        headers: {
            Cookie: `kurzname=info; JSESSIONID=${sessionId};`,
        },
    });

    const { headers, data } = res;
    console.log(res);
    console.log("---------------------");

    const cookies = headers["set-cookie"].split("; ");
    const authorizationToken = extractCookie("login", cookies);
    const sameSiteAuthorizationToken = extractCookie(
        "SameSite=None,login",
        cookies
    );

    res = await instance.get(
        "",
        {},
        {
            headers: {
                Cookie: `kurzname=info; JSESSIONID=${sessionId}; login=${authorizationToken};`,
                Referer: "https://www.kicktipp.de/info/profil/login",
            },
        }
    );

    console.log(res.headers);

    return { authorizationToken, sameSiteAuthorizationToken, headers, cookies };
}

async function profil(token, sessionId) {
    const { headers, data } = await instance.get(
        "/info/profil/",
        {},
        {
            headers: {
                Cookie: `kurzname=info; JSESSIONID=${sessionId}; login=${token}`,
            },
        }
    );
    const cookies = headers["set-cookie"].split("; ");
    token = extractCookie("login", cookies);
    return { headers, token, cookies };
}

export default { getSessionId, login, profil };
