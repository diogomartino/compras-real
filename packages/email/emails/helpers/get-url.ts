const getUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.CLIENT_URL ?? "https://example.com";
  } else {
    return "http://localhost:5173";
  }
};

export { getUrl };
