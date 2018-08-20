/* global describe, it, before, after, beforeEach, afterEach */

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSpies = require('chai-spies');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Todo = require('../models');
const seedData = require('../db/todos.json');
const { DATABASE_URL } = require('../config');

const should = chai.should();

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('Todo API:', function () {

  before(function () {  
    return mongoose.connect(DATABASE_URL, { useMongoClient: true })
      .catch(err => {
        console.error("ERROR: Mongoose failed to connect! Did you configure DATABASE_URL in the '.env'?");
        console.error(err);
      });
  });
  
  beforeEach(function () {
    return mongoose.connection.dropDatabase()
      .then(() => Todo.insertMany(seedData));
  });

  afterEach(function () {
    return mongoose.connection.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /v1/todos', function () {

    it('should respond to GET `/v1/todos` with an array of todos and status 200', function () {
      return chai.request(app)
        .get('/v1/todos')
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length(5);
          res.body.forEach((item) => {
            item.should.be.a('object');
            item.should.include.keys('id', 'title', 'completed');
          });
        });
    });

  });

  describe('GET /v1/todos/:id', function () {

    it('should return correct todo when given an id', function () {
      let doc;
      return Todo.findOne()
        .then(_doc => {
          doc = _doc
          return chai.request(app).get(`/v1/todos/${doc._id}`);
        })
        .then(function (res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.an('object');
          res.body.should.include.keys('id', 'title', 'completed');
          res.body.id.should.equal(doc.id);
          res.body.title.should.equal(doc.title);
          res.body.completed.should.equal(doc.completed);
          
        });
    });

    it('should respond with a 404 when given an invalid id', function () {
      const spy = chai.spy();
      return chai.request(app)
        .get('/v1/todos/aaaaaaaaaaaaaaaaaaaaaaaa')
        .then(spy)
        .then(() => {
          spy.should.not.have.been.called();
        })
        .catch(err => {
          err.response.should.have.status(404);
        });
    });
    
  });

  describe('POST /v1/todos', function () {

    it('should create and return a new todo when provided valid data', function () {
      const newItem = {
        'title': 'Do Dishes'
      };

      return chai.request(app)
        .post('/v1/todos')
        .send(newItem)
        .then(res => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('id', 'title', 'completed');
          res.body.title.should.equal(newItem.title);
          res.body.completed.should.equal(false);
          res.should.have.header('location', `/v1/todos/${res.body.id}`);
        });
    });

    it('should respond with 400 status when given bad data', function () {
      const badItem = {
        foobar: 'broken item'
      };
      const spy = chai.spy();
      return chai.request(app)
        .post('/v1/todos')
        .send(badItem)
        .then(spy)
        .then(() => {
          spy.should.not.have.been.called();
        })
        .catch(err => {
          err.response.should.have.status(400);
        });
    });

  });

  describe('PUT /v1/todos/:id', function () {

    it('should update item when given valid data and an id', function () {
      const item = {
        'title': 'Buy New Dishes'
      };
      
      let doc;
      return Todo.findOne()
        .then(_doc => {
          doc = _doc
          return chai.request(app).put(`/v1/todos/${doc._id}`).send(item);
        })
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('id', 'title', 'completed');
          res.body.title.should.equal(item.title);
          res.body.completed.should.be.false;
        });
    });

    it('should respond with 400 status when given bad data', function () {
      const badItem = {
        foobar: 'broken item'
      };
      const spy = chai.spy();
      
      return Todo.findOne()
        .then(doc => {
          return chai.request(app).put(`/v1/todos/${doc._id}`).send(badItem);
        })
        .then(spy)
        .then(() => {
          spy.should.not.have.been.called();
        })
        .catch(err => {
          err.response.should.have.status(400);
        });
    });

    it('should respond with a 404 for an invalid id', function () {
      const item = {
        'title': 'Buy New Dishes'
      };
      const spy = chai.spy();
      return chai.request(app)
        .put('/v1/todos/aaaaaaaaaaaaaaaaaaaaaaaa')
        .send(item)
        .then(spy)
        .then(() => {
          spy.should.not.have.been.called();
        })
        .catch(err => {
          err.response.should.have.status(404);
        });
    });

  });

  describe('DELETE /v1/todos/:id', function () {

    it('should delete an item by id', function () {
      return Todo.findOne()
        .then(doc => {
          return chai.request(app).delete(`/v1/todos/${doc._id}`);
        })
        .then(res => {
          res.should.have.status(204);
        });
    });

    it('should respond with a 404 for an invalid id', function () {
      const spy = chai.spy();
      return chai.request(app)
        .delete('/v1/todos/aaaaaaaaaaaaaaaaaaaaaaaa')
        .then(spy)
        .then(() => {
          spy.should.not.have.been.called();
        })
        .catch(err => {
          err.response.should.have.status(404);
        });
    });

  });
  
  describe("Todos Router 'todosRouter.js'", function () {

    it("the 'server.js' should not contain 'app.HTTP-METHOD()' routes", function () {
      app._router.stack.forEach(layer => {
        should.not.exist(layer.route);
      })              
    });
    
  });
 
});
