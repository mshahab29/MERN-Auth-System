const { OAuth2Client } = require("google-auth-library");
const env = require("../config/env");
const ApiError = require("./ApiError");

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const verifyGoogleIdToken = async (idToken) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new ApiError(401, "Invalid Google credential");
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, "Invalid Google credential");
  }
};

module.exports = {
  verifyGoogleIdToken,
};
