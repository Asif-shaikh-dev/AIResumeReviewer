import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());





const API_KEY = process.env.OPENROUTER_API_KEY || "your_openrouter_api_key_here";

app.post("/analyze", async (req, res) => {
  const { resumeText, jobDescription } = req.body;
  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: "Missing resumeText or jobDescription" });
  }
  

  const prompt = `You are a professional recruiter. Review the following resume and match it with the given job description.
  if resume text is not relevent to the topic of resume, return a score of 0.  If resume is too short.. add your own ideas and give it as improvements. if resume is too short..give Ats score less than 20 and you can imagine you are candidate and if you wanted to build resume based on tat information, what would you add to it. add it...
Return the result in this JSON format:
{
  "score": number (out of 100),
  "missingSkills": [array of missing skills],
  "feedback": "short feedback text",
  "improvedResume": "improved resume text"
}

Resume:
${resumeText}

Job Description:
${jobDescription}  also give improved resume text with the changes you made to improve the resume for the job description`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let result;
    try {
      result = JSON.parse(response.data.choices[0].message.content);
      // console.log("Parsed AI Response:", result);
    } catch (e) {
      console.error('JSON parse error:', e);
      return res.status(500).json({ error: "Invalid JSON from AI response" });
    }
    
    // console.log("AI Response:", result);

    res.json({
      score: result.score,
      missingSkills: result.missingSkills,
      feedback: result.feedback,
      improvedResume: result.improvedResume
    });
    
  } catch (error) {
    if (error.response) {
      // Server responded with a status outside 2xx
      console.error("OpenRouter API Error:", error.response.status, error.response.data);
    } else if (error.request) {
      // No response received
      console.error("No response from OpenRouter API:", error.request);
    } else {
      // Something else happened
      console.error("Error setting up request:", error.message);
    }
    
    res.status(500).json({ error: "OpenRouter API error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));
