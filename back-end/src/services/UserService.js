import models from "../models";

export async function findUserByUsername(username) {
  try {
    const userFound = await models.User.findByLogin(username);
    if (!userFound) return null;
    return userFound;
  } catch (error) {
    throw Error(`user ${username} not found`);
  }
}

export async function userIsAdmin(username) {
  const userFound = await findUserByUsername(username);
  const { admin } = userFound.dataValues;

  if (!admin) return false;
  return true;
}
