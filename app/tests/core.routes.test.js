'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server.js'),
    agent = request.agent(app);

process.env.NODE_ENV = 'test';

describe('Test Basic REST Functionality', function () {
    it('ping should return SUCCESS', function () {
        agent.get('/ping')
            .expect(200)
            .end(function (req, res) {
                res.body.should.match('SUCCESS');
            });
    });

    it('should mirror parameter', function () {
        agent.get('/mirror/MIRROR_DATA')
            .expect(200)
            .end(function (req, res) {
                res.body.should.match('MIRROR_DATA');
            });
    });

    it('should mirror post data', function () {
        agent.post('/mirror')
            .send({input: 'MIRROR_DATA'})
            .expect(200)
            .end(function(req, res){
                res.body.should.match('MIRROR_DATA');
            });
    });
});
