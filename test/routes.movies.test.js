process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const app = require('../index')
var request = require('supertest').agent(app.listen())

// const server = require('../index')

const knex = require('../db/connection')

describe('routes : movies', () => {
  beforeEach(() => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest() })
    .then(() => { return knex.seed.run() })
  })
  afterEach(() => {
    return knex.migrate.rollback()
  })

  describe('GET /movies', () => {
    it('should return all movies', (done) => {
      // chai.request(server)
      request
      .get('/movies')
      .end((err, res) => {
        should.not.exist(err)
        res.status.should.equal(200)
        res.type.should.equal('application/json')
        res.body.status.should.eql('success')
        res.body.data.length.should.eql(3)
        res.body.data[0].should.include.keys(
          'id', 'name', 'genre', 'rating', 'explicit'
        )
        done()
      })
    })
  })

  describe('GET /movies/:id', () => {
    it('should respond with a single movie', (done) => {
      request
      .get('/movies/1')
      .end((err, res) => {
        should.not.exist(err)
        res.status.should.equal(200)
        res.type.should.equal('application/json')
        res.body.status.should.eql('success')
        res.body.data[0].should.include.keys(
          'id', 'name', 'genre', 'rating', 'explicit'
        )
        done()
      })
    })

    it('should throw an error if the movie does not exist', (done) => {
      request
      .get('/movies/100000')
      .end((err, res) => {
        res.status.should.equal(404)
        res.type.should.equal('application/json')
        res.body.status.should.eql('error')
        res.body.message.should.eql('That movie does not exist.')
        done()
      })
    })
  })

  describe('POST /movies', () => {
    it('should return the movie that was added', (done) => {
      request
      .post('/movies')
      .send({
        name: 'Titanic',
        genre: 'Drama',
        rating: 8,
        explicit: true
      })
      .end((err, res) => {
        should.not.exist(err)
        res.status.should.equal(201)
        res.type.should.equal('application/json')
        res.body.status.should.eql('success')
        res.body.data[0].should.include.keys(
          'id', 'name', 'genre', 'rating', 'explicit'
        )
        done()
      })
    })

    it('should throw an error if the payload is malformed', (done) => {
      request
      .post('/movies')
      .send({
        name: 'Titanic'
      })
      .end((err, res) => {
        // should.exist(err)
        res.status.should.equal(400)
        res.type.should.equal('application/json')
        res.body.status.should.eql('error')
        should.exist(res.body.message)
        done()
      })
    })
  })

  describe('PUT /movies', () => {
    it('should return the movie that was updated', (done) => {
      knex('movies')
      .select('*')
      .then(movies => {
        const movieObject = movies[0]
        request
        .put(`/movies/${movieObject.id}`)
        .send({
          rating: 9
        })
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.type.should.equal('application/json')
          res.body.status.should.eql('success')
          res.body.data[0].should.include.keys(
            'id', 'name', 'genre', 'rating', 'explicit'
          )
          const newMovieObject = res.body.data[0]
          newMovieObject.rating.should.not.eql(movieObject.rating)
          done()
        })
      })
    })

    it('should throw an error if the movie does not exist', (done) => {
      request
      .put('/movies/100000')
      .send({
        rating: 10
      })
      .end((err, res) => {
        // should.exist(err)
        res.status.should.equal(404)
        res.type.should.equal('application/json')
        res.body.status.should.eql('error')
        res.body.message.should.eql('The movie does not exist.')
        done()
      })
    })
  })

})
