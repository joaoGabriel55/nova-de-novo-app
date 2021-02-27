import bcrypt from "bcrypt";
import { Exception } from "../exceptions/responseException";
import {findUserByUsername} from '../services/UserService'
import models from "../models";

const SALT = 10;

const index = async (req, res) => {};

const findByUsername = async (req, res) => {
  const username = req.params.username;
  let user = await findUserByUsername(username);

  if (!user) return Exception(res, 400, `User '${username}' not found`);

  return res.status(200).json({ username: user.username });
};

const store = async (req, res) => {
  const { username, email, password } = req.body;
  let user = await models.User.findByLogin(username);
  if (user) return Exception(res, 400, `User '${username}' already exists!`);

  let passwordHash = bcrypt.hashSync(password, SALT);

  await models.User.create({
    username,
    email,
    admin: false,
    password: passwordHash,
  });
  return res.status(201).json({ username, email });
};

const update = async (req, res) => {};

const destroy = async (req, res) => {};

export default { index, findByUsername, store, update, destroy };
