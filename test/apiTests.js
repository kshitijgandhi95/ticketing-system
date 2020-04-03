let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
var assert = require('assert');

chai.use(chaiHttp);

describe('Routes test', function() {
    // it('available seats', (done) => {
    //     chai.request(server)
    //         .get('/available-tickets')
    //         .end((err, res) => {
    //               res.should.have.status(200);
    //               res.body.should.be.a('array');
    //               res.body.length.should.be.eql(40);
    //           done();
    //         });
    //   });

      it('should be able to book ticket', (done) => {
        let payload = {
            seatNum: 17,
            userDetails: {
                name: "Kshitij",
                phoneNumber: 11323312,
                emailId: "kshitij@gmail.com"
                }
        }
        chai.request(server)
            .post('/book-ticket')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.a('string')
                  res.body.should.be.eql("Ticket booked succesfully");
              done();
            });
      });
});