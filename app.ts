import express from "express";

const app: express.Application = express();
const PORT: number = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
