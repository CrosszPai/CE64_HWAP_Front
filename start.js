const concurrently = require("concurrently");
const path = require('path')
const { result } = concurrently(
  [
    { command: "npm run start", name: "start" },
  ],
  {
    prefix: "dev",
    killOthers: ["failure", "success"],
    restartTries: 3,
    cwd: path.resolve(__dirname, "."),
  }
);
