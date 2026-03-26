require("dotenv").config();
const express = require("express");
const session = require("express-session");
const axios = require("axios");

const app = express();
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "google-ads-secret",
  resave: false,
  saveUninitialized: false
}));

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

app.get("/auth/google", (req, res) => {
  const url = `${GOOGLE_AUTH_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/adwords&access_type=offline&prompt=consent`;
  res.redirect(url);
});

app.get("/auth/google/callback", async (req, res) => {
  try {
    const { code } = req.query;

    const tokenRes = await axios.post(TOKEN_URL, {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code"
    });

    req.session.accessToken = tokenRes.data.access_token;
    req.session.refreshToken = tokenRes.data.refresh_token;

    res.redirect("/dashboard.html");
  } catch (e) {
    res.status(500).send("Auth error");
  }
});

app.get("/api/accounts", async (req, res) => {
  try {
    const r = await axios.get("https://googleads.googleapis.com/v14/customers:listAccessibleCustomers", {
      headers: {
        Authorization: `Bearer ${req.session.accessToken}`,
        "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN
      }
    });

    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/campaigns/:customerId", async (req, res) => {
  try {
    const query = `SELECT campaign.id, campaign.name, metrics.clicks, metrics.impressions, metrics.cost_micros FROM campaign`;

    const r = await axios.post(
      `https://googleads.googleapis.com/v14/customers/${req.params.customerId}/googleAds:search`,
      { query },
      {
        headers: {
          Authorization: `Bearer ${req.session.accessToken}`,
          "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN
        }
      }
    );

    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/analyze", (req, res) => {
  const { campaigns } = req.body;

  const issues = [];

  campaigns.forEach(c => {
    const ctr = c.metrics.clicks / c.metrics.impressions;

    if (ctr < 0.02) {
      issues.push({ campaign: c.campaign.name, problem: "CTR baixo" });
    }
  });

  res.json({ issues });
});

app.use(express.static("public"));

app.listen(3000, () => console.log("Server running"));