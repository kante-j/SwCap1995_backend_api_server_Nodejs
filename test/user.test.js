var assert = require("assert");
var should = require('should');
var mocha = require('mocha');
var request = require("supertest");
var expect = require("chai").expect;
var server = require("../app.js");


describe("유저 정보 불러오기 테스트 ->", function () {
    var svr = "http://localhost:3000";

    describe("유저 정보 불러오기 ->", function () {
        it("불러오기 성공", function (done) {

            request(svr)
                .get("/users")
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("불러오기 실패", function (done) {

            request(svr)
                .get("/users")
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        after(function () {
            // server.close();
        });
    })

    describe("닉네임 데이터베이스 있는지 여부 불러오기 ->", function () {
        var isdata={
            nickname: '지석이닷'
        };
        var is_not_data={
            nickname: '징석이닷asdasd'
        };

        it("불러오기 성공", function (done) {

            request(svr)
                .post("/users/is_nickname")
                .send(isdata)
                .expect(500)
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    if (err) return done(err);

                    done();
                });
        });

        it("불러오기 실패", function (done) {

            request(svr)
                .post("/users/is_nickname")
                .send(is_not_data)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        after(function () {
            // server.close();
        });
    })

    describe("얼굴인식 여부 ->", function () {
        var user_id = 90;
        var not_user_id = 91;

        it("얼굴인식 정보 있음", function (done) {

            request(svr)
                .get("/users/is_face_detection/"+user_id)
                .expect('true')
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    if (err) return done(err);

                    done();
                });
        });

        it("얼굴인식 정보 없음", function (done) {

            request(svr)
                .get("/users/is_face_detection/"+not_user_id)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        after(function () {
            // server.close();
        });
    })

    describe("유저가 테이블에 있는지에 대한 여부 email로 테스트 ->", function () {
        var isuser={
            email: 'wltjr0920@ajou.ac.kr'
        }
        var notuser={
            email: 'wltjr0920@ajouw.ac.kr'
        }

        it("유저 정보 있음", function (done) {

            request(svr)
                .post("/users/is_user")
                .send(isuser)
                .expect('{"id":42}')
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    if (err) return done(err);

                    done();
                });
        });

        it("유저 정보 없음", function (done) {

            request(svr)
                .post("/users/is_user")
                .send(notuser)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        after(function () {
            // server.close();
        });
    })
});
