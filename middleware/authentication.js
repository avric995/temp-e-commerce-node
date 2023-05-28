const CustomErr = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
  //in singnedCookies if we did not sign them it will just be in the cookies
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomErr.UnauthenticatedError('Authentication Invalid');
  }

  try {
    const { name, userId, role } = isTokenValid({ token });

    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new CustomErr.UnauthenticatedError('Authentication Invalid');
  }
};

// vidi ...rest(roles) operator sutra
const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomErr.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }

    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};