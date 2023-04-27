import { FieldValue } from "firebase-admin/firestore"; 
import { db } from "./dbConnect.js";

const collection = db.collection('users')

export async function signUp(req, res) {
  const { email, password } = req.body
  if(!email || password.length < 6) {
    res.status(400).send({message: "Email and Password are both required. Password must be 6 characters or more"})
    return
  }
  // todo: check if email is already in use
  const newUser = {
    email: email.toLowerCase(),
    password,
    createdAt: FieldValue.serverTimestamp(),
  }
  await collection.add(newUser)
  // once user is added, log them in 
  login(req,res)
}

export async function login(req, res) {
  const { email, password } = req.body
  if(!email || !password) {
    res.status(400).send({message: "Email and Password are both required"})
    return
  }
  const users = await collection
    .where("email", "==", email.toLowerCase())
    .where("password", "==", password)
    .get()
  let user = users.docs.map(doc => ({...doc.data(), id: doc.id}))[0] //.map returns an array, [0] to just get first thing in array
  if(!user) {
    res.status(400).send({message: "Invalid email and/or password."})
    return
  } //handles if they didn't put in correct email/password
  delete user.password //deletes from the object, not the database.. just sends back email and not password
  res.send(user) // successfully logged in, sends back {email, createdAt, id}
}
