const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Utility function to check file validity
const getFileDetails = (fileBase64) => {
  const matches = fileBase64.match(/^data:(.+);base64,(.+)$/);
  if (!matches) return { valid: false };

  const mimeType = matches[1];
  const base64Data = matches[2];
  const validMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (!validMimeTypes.includes(mimeType)) return { valid: false };

  const fileSizeKb = Buffer.from(base64Data, "base64").length / 1024;
  return { valid: true, mimeType, fileSizeKb };
};

// GET endpoint
app.get("/api/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// POST endpoint
app.post("/api/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;

  if (!Array.isArray(data)) {
    return res
      .status(400)
      .json({ is_success: false, message: "Invalid input data format." });
  }

  const user_id = "Manoj_SR_17112003";
  const email = "mr1152@srmist.edu.in";
  const roll_number = "RA2111027020103";

  const numbers = data.filter((item) => !isNaN(item));
  const alphabets = data.filter((item) => /^[a-zA-Z]$/.test(item));

  const lowercaseAlphabets = alphabets.filter((item) => /^[a-z]$/.test(item));
  const highest_lowercase_alphabet = lowercaseAlphabets.length
    ? [lowercaseAlphabets.sort((a, b) => b.localeCompare(a))[0]]
    : [];

  let file_valid = false;
  let file_mime_type = "";
  let file_size_kb = 0;

  if (file_b64) {
    const fileDetails = getFileDetails(file_b64);
    if (fileDetails.valid) {
      file_valid = true;
      file_mime_type = fileDetails.mimeType;
      file_size_kb = fileDetails.fileSizeKb.toFixed(2);
    }
  }

  res.status(200).json({
    is_success: true,
    user_id,
    email,
    roll_number,
    numbers,
    alphabets,
    highest_lowercase_alphabet,
    file_valid,
    file_mime_type,
    file_size_kb,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
