const express = require('express')
const app = express()
app.use(express.json())
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
let db = null
const dbPath = path.join(__dirname, 'moviesData.db')
const initializeAndStartDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB error:${e.message}`)
    process.exit(1)
  }
}
initializeAndStartDb()
module.exports = app
const convertDbObjectToResponseObject = dbobject => {
  return {
    movieName: dbobject.movie_name,
  }
}
//api1
app.get('/movies/', async (request, response) => {
  const movieQuery = `select * from movie`
  let movies = await db.all(movieQuery)
  response.send(
    movies.map(eachmovie => convertDbObjectToResponseObject(eachmovie)),
  )
})
//api2
app.post('/movies/', async (request, response) => {
  const movie_details = request.body
  const {directorId, movieName, leadActor} = movie_details
  const addmoviequery = `insert into movie
  (director_id,movie_name,lead_actor)
  values(${directorId},'${movieName})','${leadActor})`
  const dbresponse = await db.run(addmoviequery)
  const movie_id = dbresponse.last_Id
  response.send('Movie Successfully Added')
})
