require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIEDEX = require('./movies-data-small.json')

console.log(process.env.API_TOKEN)

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())


app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization').split(' ')[1]

    if (!authToken || authToken !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    } 

    next()
})

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' }}
    } else {
        response = { error }
    }
    res.status(500).json(response)
})

app.get('/movie', function handleGetMovie(req, res) {
    let response = MOVIEDEX
    const { genre, country, avg_vote } = req.query

    if(genre) {
        response = response.filter(movies =>
            movies.genre.toLowerCase().includes(genre.toLowerCase()))
    }

    if(country) {
        response = response.filter(movies =>
            movies.country.toLowerCase().includes(country.toLowerCase()))
    }

    if(avg_vote) {
        response = response.filter(movies=>
            movies.avg_vote >= avg_vote)
    }

    res.json(response)


})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {

})