import { FieldValue } from "firebase-admin/firestore";
import jwt from 'jsonwebtoken'
import { db } from "./dbConnect.js";
import { secretKey } from "../secrets.js";

const collection = db.collection("shows")

export async function getShows(req,res) {
  const showsCollection = await collection.get()
  const shows = showsCollection.docs.map(doc => ({...doc.data(), id: doc.id}))
  res.send(shows)
}

export async function addShow(req,res) {
  const token = req.headers.authorization
  if(!token) {
    res.status(401).send({message: "Unauthorized. A valid token is required."})
    return
  }
  const decoded = jwt.verify(token, secretKey) //10. verify token
  if(!decoded) {
    res.status(401).send({message: "Unauthorized. A valid token is required."})
    return
  }
  const { title, poster, seasons } = req.body
  if(!title) {
    res.status(400).send({ message: "Show title is required."})
    return
  }
  const newShow = {
    title,
    poster,
    seasons,
    createdAt: FieldValue.serverTimestamp(),
  }
  await collection.add(newShow) //add new show to collection
  getShows(req,res) // return the updated list
}

export async function deleteShow(req,res) {
  const {showId} = req.params
  await collection.doc(showId).delete()
  getShows(req,res)
}