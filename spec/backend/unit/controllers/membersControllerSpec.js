'use strict';

const specHelper = require('../../../support/specHelper'),
      sinon = specHelper.sinon,
      Q = specHelper.Q,
      memberService = require('../../../../src/backend/services/memberService'),
      messagingService = require('../../../../src/backend/services/messagingService'),
      memberValidator = require('../../../../src/lib/memberValidator');

var membersController = require('../../../../src/backend/controllers/membersController');

describe('membersController', () => {

    describe('newMemberHandler', () => {
        let newMemberHandler,
            goodRequest, res,
            residentialAddress, postalAddress,
            createMemberStub, createMemberPromise,
            validateMemberStub, sendVerificationEmailPromise,
            sendVerificationEmailStub;

        beforeEach(() => {
            newMemberHandler = membersController.newMemberHandler;
            createMemberStub = sinon.stub(memberService, 'createMember');
            validateMemberStub = sinon.stub(memberValidator, 'isValid');
            sendVerificationEmailStub = sinon.stub(messagingService, 'sendVerificationEmail');
            res = {status: sinon.stub().returns({json: sinon.spy()})};

            residentialAddress = {
                address: '221b Baker St',
                suburb: 'London',
                country: 'England',
                state: 'VIC',
                postcode: '1234'
            };
            postalAddress = {
                address: '47 I dont want your spam St',
                suburb: 'Moriarty',
                country: 'USA',
                state: 'NM',
                postcode: '5678'
            };

            goodRequest = {
                body: {
                    firstName: 'Sherlock',
                    lastName: 'Holmes',
                    email: 'sherlock@holmes.co.uk',
                    gender: 'detective genius',
                    dateOfBirth: '22/12/1900',
                    primaryPhoneNumber: '0396291146',
                    secondaryPhoneNumber: '0394291146',
                    residentialAddress: residentialAddress,
                    postalAddress: postalAddress,
                    membershipType: 'full'
                }
            };

            createMemberPromise = Q.defer();
            createMemberStub
                .withArgs(goodRequest.body)
                .returns(createMemberPromise.promise);

            sendVerificationEmailPromise = Q.defer();
            sendVerificationEmailStub.returns(sendVerificationEmailPromise.promise);
        });

        afterEach(() => {
            memberService.createMember.restore();
            memberValidator.isValid.restore();
            messagingService.sendVerificationEmail.restore();
        });

        describe('when it receives a good request', () => {
            let expectedMemberCreateValues;
            let createdMember = {id:'1234', membershipType: 'full', email: 'sherlock@holmes.co.uk'};

            beforeEach(() => {
                validateMemberStub.returns([]);
                createMemberPromise.resolve(createdMember);
                sendVerificationEmailPromise.resolve();

                expectedMemberCreateValues = {
                    firstName: 'Sherlock',
                    lastName: 'Holmes',
                    email: 'sherlock@holmes.co.uk',
                    gender: 'detective genius',
                    dateOfBirth: '22/12/1900',
                    primaryPhoneNumber: '0396291146',
                    secondaryPhoneNumber: '0394291146',
                    residentialAddress: residentialAddress,
                    postalAddress: postalAddress,
                    membershipType: 'full'
                };
            });

            fit('creates a new member', (done) => {
                newMemberHandler(goodRequest, res)
                .finally(() => {
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(res.status().json).toHaveBeenCalledWith({newMember: {email: createdMember.email}});
                    expect(messagingService.sendVerificationEmail).toHaveBeenCalledWith(createdMember);
                }).then(done, done.fail);
            });
        });

        describe('when validation fails', () => {
            it('responds with status 400',(done) => {
                validateMemberStub.returns(['firstName']);
                newMemberHandler(goodRequest, res);

                expect(memberService.createMember).not.toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(400);
                done();
            });
        });
    });

    describe('verify', () => {
      let res, req;
      let verificationStub;
      let verificationPromise;

      beforeEach(() => {
        req = {};
        res = {
          redirect: sinon.spy(),
          render: sinon.spy(),
          sendStatus: sinon.spy()
        };

        verificationPromise = Q.defer();
        verificationStub = sinon.stub(memberService, 'verify').returns(verificationPromise.promise);
      });

      afterEach(() => {
        memberService.verify.restore();
      });

      it('should return 400 when the hash is not valid', (done) => {
        req = {
          params: {
            hash: 'ZZZZZooooWrong'
          }
        };

        membersController.verify(req, res)
        .catch(() => {
          expect(verificationStub).not.toHaveBeenCalled();
          expect(res.sendStatus).toHaveBeenCalledWith(400);
        }).then(done, done.fail);
      });

      it('redirect to /verified when account successfully verified', (done) => {
        verificationPromise.resolve({email: 'sherlock@holmes.co.uk', verified: true});

        req = {
          params: {
            hash: '1d225bd0-57b5-4b87-90fc-f76ddc997e57'
          }
        };

        membersController.verify(req, res)
        .finally(() => {
          expect(verificationStub).toHaveBeenCalledWith(req.params.hash);
          expect(res.redirect).toHaveBeenCalledWith('/verified');
        }).then(done, done.fail);
      });

      it('should return a 400 when the account could not be verified', (done) => {
        verificationPromise.reject('The account could not be verified');

        req = {
          params: {
            hash: '1d225bd0-57b5-4b87-90fc-f76ddc997e57'
          }
        };

        membersController.verify(req, res)
        .finally(() => {
          expect(verificationStub).toHaveBeenCalled();
          expect(res.sendStatus).toHaveBeenCalledWith(400);
        }).then(done, done.fail);
      });
    });
});
