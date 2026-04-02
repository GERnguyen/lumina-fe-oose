const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:9090/api",
  accessToken: import.meta.env.VITE_ACCESS_TOKEN_KEY ?? "accessToken",
};

export default env;
