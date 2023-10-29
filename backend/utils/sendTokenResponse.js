function sendTokenResponse(user, token, statusCode, res) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3600000,
  });

  res.status(statusCode).json({
    status: "success",
    user: user,
    token
  });
}


  module.exports = sendTokenResponse;