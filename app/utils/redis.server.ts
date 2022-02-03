import { createClient } from "redis";

let redis: ReturnType<typeof createClient>;

declare global {
  var __redis: ReturnType<typeof createClient> | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
  redis = createClient({
    url: "redis://localhost:6379/0",
  });
  redis.connect();
} else {
  if (!global.__redis) {
    global.__redis = createClient({
      url: "redis://localhost:6379/0",
    });
    global.__redis.connect();
  }
  redis = global.__redis;
}

export { redis };
