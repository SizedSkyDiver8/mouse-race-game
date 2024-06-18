const express = require("express");
const path = require("path");

const app = express();
const PORT = 8080;

// Serve static files from the "dist" and root directory
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname)));

// Handle requests for the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
