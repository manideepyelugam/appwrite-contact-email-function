export default async ({ req, res, log }) => {
  log("Contact email function triggered");

  const body = req.bodyJson || {};

  log("Received data:", body);

  return res.json({
    success: true,
    message: "Function executed successfully",
    received: body
  });
};
