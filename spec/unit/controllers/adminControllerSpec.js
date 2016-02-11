'use strict';

const specHelper = require("../../support/specHelper"),
      sinon = specHelper.sinon,
      Promise = specHelper.models.Sequelize.Promise,
      memberService = require("../../../services/memberService");

var adminController = require("../../../controllers/adminController");

describe("adminController", () => {
    describe("membersList",  () => {
        let res,
            req,
            jsonStub,
            memberList;

        let membersList = adminController.membersList;

        beforeEach(() => {
            jsonStub = sinon.stub();

            res = {
                status: sinon.stub().returns({json: jsonStub})
            };

            req = {};

            memberList = [{ firstName: "bob" }];

            sinon.stub(memberService, "list");
        });

        afterEach(() => {
            memberService.list.restore();
        });

        it("responds with a list of members", (done) => {
            memberService.list.returns(Promise.resolve(memberList));

            membersList(req, res).finally(() => {
                expect(res.status).toHaveBeenCalled(200);
                expect(jsonStub).toHaveBeenCalledWith({ members: memberList });
            }).then(done, done.fail);
        });

        it("responds with an error list of members", (done) => {
            let error = "Liar liar pants on fire";
            memberService.list.returns(Promise.reject(error));

            membersList(req, res).finally(() => {
                expect(res.status).toHaveBeenCalled(500);
                expect(jsonStub).toHaveBeenCalledWith({ error: error });
            }).then(done, done.fail);
        });
    });
});
