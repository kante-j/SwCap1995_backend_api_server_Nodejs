var assert = require("assert");
var should = require('should');
var mocha = require('mocha');
var request = require("supertest");
var expect = require("chai").expect;
var server = require("../app.js");


describe("플랜 정보 불러오기 테스트 ->", function () {
    var svr = "http://localhost:3000";

    describe("플랜 정보 불러오기 ->", function () {
        it("불러오기 성공", function (done) {

            request(svr)
                .get("/plans")
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("불러오기 실패", function (done) {

            request(svr)
                .get("/plans")
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        after(function () {
            // server.close();
        });
    });

    describe("감시중인 플랜 모두 불러오기 ->", function () {
        var is_user_id = 69;
        var is_not_user_id = 30;

        it("불러오기 성공", function (done) {

            request(svr)
                .get("/plans/watchingAll/" + is_user_id)
                .expect(200)
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    if (err) return done(err);

                    done();
                });
        });

        it("불러오기 실패", function (done) {

            request(svr)
                .get("/plans/watchingAll/" + is_not_user_id)
                .expect('{"count":0,"rows":[]}')
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        after(function () {
            // server.close();
        });
    })


    describe("카테고리 필터 테스트 ->", function () {
        var is_query = '20';
        var is_not_query = '90';

        it("카테고리 필터 있음", function (done) {

            request(svr)
                .get("/plans/filter_age?age="+is_query)
                .expect(200)
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    if (err) return done(err);

                    done();
                });
        });

        it("카테고리 필터 없음", function (done) {
            request(svr)
                .get("/plans/filter_age?age="+is_not_query)
                .expect('{"plans":[],"pageCount":0,"itemCount":0,"pages":[]}')
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        after(function () {
            server.close();
        });
    })
});
