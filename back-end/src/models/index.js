import dotenv from "dotenv";
import config from "../../config.json";
dotenv.config();

import Sequelize from "sequelize";
const env = process.env.NODE_ENV || "development";

const { database, username, password, dialect, host } = config[env];

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
});

const models = {
  User: sequelize.import("./User"),
  Customer: sequelize.import("./Customer"),
  Dressmaker: sequelize.import("./Dressmaker"),
  Service: sequelize.import("./Service"),
  ServiceType: sequelize.import("./ServiceType"),
  ServiceOrder: sequelize.import("./ServiceOrder"),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
