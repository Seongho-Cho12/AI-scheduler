const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// ✅ Google 로그인 URL 생성
app.get("/auth/google", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    response_type: "code", // ✅ 추가 (인증 코드 요청)
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });
  res.redirect(authUrl);
});

// ✅ OAuth 2.0 콜백 처리
app.get("/auth/callback", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: "Authorization code is missing!" });
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    res.json({ message: "Google 로그인 성공!", tokens });
  } catch (error) {
    console.error("로그인 실패:", error);
    res.status(500).json({ error: "로그인 실패" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
