function sendTokenResponse(user, accessToken, refreshToken, statusCode, res) {

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
  });

  res.status(statusCode).json({
    status: "success",
    user: user,
    accessToken
  });
}


  module.exports = sendTokenResponse;