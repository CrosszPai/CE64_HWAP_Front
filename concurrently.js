const concurrently = require("concurrently");
const path = require('path')
const { result } = concurrently(
  [
    { command: "npm run dev:css", name: "css" },
    { command: "remix dev", name: "remix" },
  ],
  {
    prefix: "dev",
    killOthers: ["failure", "success"],
    restartTries: 3,
    cwd: path.resolve(__dirname, "."),
  }
);
