var assert = require("assert");
var should = require('should');
var mocha = require('mocha');
var request = require("supertest");
var expect = require("chai").expect;
var server = require("../app.js");


describe("친구 테스트 ->", function () {

    var svr = "http://localhost:3000";

    var data ={
        user_id : 23,
        nickname:'지석이닷'
    };

    var not_data ={
        user_id : 23,
        nickname:'오오오옹'
    };


    var not_data2 ={
        user_id : 2000,
        nickname:'지석이닷'
    };

    describe("친구 목록 받아오기  ->", function () {
        it("성공", function (done) {

            request(svr)
                .get("/friends/"+data.user_id)
                .set('Accept', 'application/json')
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("유저가 없을 때 실패", function (done) {
            request(svr)
                .get("/friends/"+not_data2.user_id)
                .set('Accept', 'application/json')
                .expect('{"count":0,"rows":[]}')
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("친구 없을 때 실패", function (done) {
            request(svr)
                .get("/friends/1")
                .set('Accept', 'application/json')
                .expect('{"count":0,"rows":[]}')
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

    });

    describe("친구 신청 ->", function () {
        it("성공", function (done) {
            request(svr)
                .put("/friends/add")
                .send(data)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("유저가 없을 때 실패", function (done) {
            request(svr)
                .put("/friends/add")
                .send(not_data)
                .expect(500)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("닉네 없을 때 실패", function (done) {
            request(svr)
                .put("/friends/add")
                .send(not_data2)
                .expect(500)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

    });
});
