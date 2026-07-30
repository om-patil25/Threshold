import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Beginning of project");
});

app.post("/", (req, res) => {
  res.send("POST request received!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
