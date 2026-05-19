export function notFound(req, res, _next) {
  res.status(404).json({
    error: "not_found",
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
}

export function errorHandler(err, _req, res, _next) {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  if (process.env.NODE_ENV !== "test") {
    console.error("[error]", err.message);
  }
  res.status(status).json({
    error: err.code || "internal_error",
    message: err.message || "Something broke.",
  });
}
