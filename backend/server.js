/*import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // put in .env
});

// API endpoint
app.post("/generate-article", async (req, res) => {
  try {
    const { topic, length } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",   // fast & good for text gen
      messages: [
        { role: "system", content: "You are a professional article writer." },
        { role: "user", content: `Write an article about "${topic}" in around ${length} words. Make it engaging and well-structured.` },
      ],
    });

    const article = response.choices[0].message.content;
    res.json({ article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});*/


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =====================
// 1. Article generator
// =====================
app.post("/generate-article", async (req, res) => {
  try {
    const { topic, length } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional article writer." },
        {
          role: "user",
          content: `Write an article about "${topic}" in around ${length} words. Make it engaging and well-structured.`,
        },
      ],
    });

    const article = response.choices[0].message.content;
    res.json({ article });
  } catch (error) {
    console.error("Article generation error:", error);
    res.status(500).json({ error: "Something went wrong while generating the article!" });
  }
});

// =====================
// 2. Blog title generator
// =====================
app.post("/generate-title", async (req, res) => {
  try {
    const { keyword, category } = req.body;

    if (!keyword || !category) {
      return res.status(400).json({ error: "Keyword and category are required." });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a creative blog title generator." },
        {
          role: "user",
          content: `Generate 5 catchy and engaging blog titles for the keyword "${keyword}" under the category "${category}". Return them as a numbered list.`,
        },
      ],
    });

    const titlesRaw = response.choices[0].message.content;
    const suggestions = titlesRaw
      .split("\n")
      .map((t) => t.replace(/^\d+\.\s*/, "").trim())
      .filter((t) => t);

    res.json({ suggestions });
  } catch (error) {
    console.error("Title generation error:", error);
    res.status(500).json({ error: "Failed to generate titles." });
  }
});

// =====================
// 3. AI image generator
// =====================
app.post("/generate-image", async (req, res) => {
  try {
    const { prompt, style, publish } = req.body;

    if (!prompt || !style) {
      return res.status(400).json({ error: "Prompt and style are required." });
    }

    // Combine style and prompt for better context
    const styledPrompt = `${style} image of ${prompt}`;

    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt: styledPrompt,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;

    res.json({ imageUrl, publish });
  } catch (error) {
    console.error("Image generation error:", error);
    res.status(500).json({ error: "Failed to generate image." });
  }
});

// =====================
// Start the server
// =====================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
