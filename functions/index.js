import functions from 'firebase-functions'
import express from 'express'
import cors from 'cors'
import { login, signUp } from './src/users.js'
import { addShow, getShows } from './src/shows.js'

const app = express()
app.use(cors())
app.use(express.json())

// User Routes:
app.post("/signup", signUp)
app.post("/login", login)

// Show Routes:
app.get("/shows", getShows)
app.post("/shows", addShow)

//lets us run locally without emultators
app.listen(3000, () => console.log(`Listening on http://localhost:3000...`))

export const api = functions.https.onRequest(app) //exports our cloud function 
