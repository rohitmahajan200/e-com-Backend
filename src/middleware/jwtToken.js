import jwt from "jsonwebtoken";

export const jwtAuth = (req, res, cb) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("You are not authorise!!!");
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userID;
  } catch (error) {
    console.log(error);
    return res.status(401).send("You are not authorise!!!");
  }
  cb();
};
