export default async ({ req, res, log }) => {
  log("Contact email function triggered");

  let body;
  try {
    body = req.bodyJson || {};
  } catch (error) {
    log("Error parsing request body:", error);
    return res.json({
      success: false,
      message: "Invalid JSON in request body",
      error: error.message
    }, 400);
  }

  log("Received data:", body);

  return res.json({
    success: true,
    message: "Function executed successfully",
    received: body
  });
};
