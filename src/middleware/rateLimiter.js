import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    //in production, you might want to use a more specific key, such as user ID or IP address
    const { success } = await ratelimit.limit("my-rate-limit");

    if (!success) {
      return res
        .status(429)
        .json({ message: "Too many requests, please try again later." });
    }
    next();
  } catch (error) {
    console.log("Rate limiting error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default rateLimiter;
