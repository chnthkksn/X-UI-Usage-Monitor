import jwt from "jsonwebtoken";

const user = process.env.PANEL_USERNAME;
const secret = process.env.JWT_SECRET;

const checkAdmin = (req, res, next) => {
  const token = req.cookies.token;
  try {
    const decoded = jwt.verify(token, secret);
    if (decoded.username === user) {
      next();
    } else {
      res.status(401).json({ message: "Invalid credentials, Login again !" });
    }
  } catch (err) {
    res.status(401).json({ message: "Invalid credentials, Login again !" });
  }
};

export default checkAdmin;
