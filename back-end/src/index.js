import dotenv from 'dotenv'
import "core-js/stable"
import "regenerator-runtime/runtime"
import express from 'express'
import routes from './routes'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import jwt from 'jsonwebtoken'
import authRoutes from './auth/routes'

import models, { sequelize } from './models'
import { Exception } from './exceptions/responseException'

// get config vars
dotenv.config();


const app = express()

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes.authentication)
app.use('/users', authenticateToken, routes.user)

function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return Exception(res, 401, `Token is empty`)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return Exception(res, 403, `Invalid Token`)
        req.user = user
        next() // pass the execution off to whatever request the client intended
    })
}

const eraseDatabaseOnSync = false;

sequelize.sync({ force: eraseDatabaseOnSync })

export default app