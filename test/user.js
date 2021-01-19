import chai from "chai"
const { should, use } = chai
import chaiHttp from "chai-http"
import { describe, it } from "mocha"
import app from "../app.js"


should()

use(chaiHttp)

describe("users api", () => {
    
    /**
     * testing the /login route
     */
    describe("POST /api/user/login", () => {
        it("It shoult nothing", (done) => {
            chai.request(app).post('/api/user/login').end((err,res) => {
                res.should.have.status(400)
                res.body.should.be.a("Object")
                res.body.should.have.property('message')
                done();
            })
        })
    })


})



