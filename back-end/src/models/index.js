import dotenv from 'dotenv'
dotenv.config();

import Sequelize from 'sequelize';
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config.json')[env];
const url = process.env.DATABASE_URL_DEV

const sequelize = new Sequelize(url, { dialect: 'postgres' });

const models = {
    User: sequelize.import('./User'),
    Customer: sequelize.import('./Customer'),
    Dressmaker: sequelize.import('./Dressmaker')
};

Object.keys(models).forEach((key) => {
    if ('associate' in models[key]) {
        models[key].associate(models);
    }
});

export { sequelize };

export default models;