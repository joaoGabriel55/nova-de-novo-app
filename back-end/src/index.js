import cookieParser from "cookie-parser";
import "core-js/stable";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import logger from "morgan";
import "regenerator-runtime/runtime";
import authRoutes from "./auth/routes";
import { Exception } from "./exceptions/responseException";
import { sequelize } from "./models";
import routes from "./routes";
import { userIsAdmin } from "./services/UserService";

// get config vars
dotenv.config();

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes.authentication);
app.use("/users", authenticateToken, routes.user);

app.use("/customers", authenticateToken, routes.customer);
app.use("/dressmakers", authenticateToken, routes.dressmaker);
app.use("/services", authenticateToken, routes.service);
app.use("/service-types", authenticateToken, routes.serviceType);
app.use("/service-orders", authenticateToken, routes.serviceOrder);

async function authenticateToken(req, res, next) {
  // Gather the jwt access token from the request header
  const auth = process.env.USE_AUTH;
  if (auth !== "false") {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return Exception(res, 401, `Token is empty`);

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
      console.error(err);

      if (!(await userIsAdmin(user.username)))
        return Exception(res, 401, `User '${user.username}' is not admin!`);

      if (err) return Exception(res, 403, `Invalid Token`);

      req.user = user;
      next(); // pass the execution off to whatever request the client intended
    });
  } else {
    next();
  }
}

const eraseDatabaseOnSync = false;

sequelize.sync({ force: eraseDatabaseOnSync });

export default app;
