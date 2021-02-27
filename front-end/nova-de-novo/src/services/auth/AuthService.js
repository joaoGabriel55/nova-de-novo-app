import { API } from "../Api";
import jwt from "jsonwebtoken";
const dotenv = require("dotenv");
dotenv.config();

export const userLogin = (userCredentials) => {
  const secret = process.env.REACT_APP_TOKEN_SECRET;
  userCredentials.password = jwt.sign(
    { passwordHash: userCredentials.password },
    secret,
    { expiresIn: "120s" }
  );
  return API.post("/auth/login", userCredentials);
};
