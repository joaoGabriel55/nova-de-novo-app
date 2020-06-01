import dotenv from 'dotenv'
import "core-js/stable"
import "regenerator-runtime/runtime"
import express from 'express'
import routes from './routes'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import models, { sequelize } from './models'

// get config vars
dotenv.config();


const app = express()

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use(express.json())
app.use('/users', routes.user)

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync })

export default app