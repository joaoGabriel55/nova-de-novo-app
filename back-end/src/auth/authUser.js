import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config();

function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET instanceof String, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next() // pass the execution off to whatever request the client intended
    })
}

const generateAccessToken = (username, password) => {
    return jwt.sign({ username, password }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

export default { generateAccessToken, authenticateToken }