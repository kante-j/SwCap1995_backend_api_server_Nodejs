var assert = require("assert");
var should = require('should');
var mocha = require('mocha');
var request = require("supertest");
var expect = require("chai").expect;
var server = require("../app.js");


describe("포인트 테스트 ->", function () {

    var svr = "http://localhost:3000";

    var data ={
        user_id : 61,
        class: 'challenge',
        amount: 3000
    };

    var not_data ={
        user_id : 612,
        class: 'challenge',
        amount: 'aa'
    };
    describe("포인트 추가 ->", function () {
        it("성공", function (done) {

            request(svr)
                .post("/points/add")
                .send(data)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("실패", function (done) {

            request(svr)
                .post("/points/add")
                .send(not_data)
                .expect(500)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

    });
});
