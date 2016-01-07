"use strict";

const specHelper = require("../../support/specHelper"),
      models = specHelper.models,
      Invoice = models.Invoice,
      sinon = specHelper.sinon,
      Q = specHelper.Q,
      logger = specHelper.logger,
      moment = require('moment');

var invoiceService = require("../../../services/invoiceService");

describe('invoiceService', () => {

  describe("createInvoice", () => {

    let invoiceStub, loggerStub,
        newInvoice, expectedNewInvoice,
        invoicePromise;

    beforeEach(() => {
        invoiceStub = sinon.stub(models.Invoice, 'create');
        loggerStub = sinon.stub(logger, 'info');

        newInvoice = {
          memberEmail: "sherlock@holmes.co.uk",
          totalAmount: 60,
          paymentType: 'deposit',
        };

        expectedNewInvoice = {
          memberEmail: "sherlock@holmes.co.uk",
          totalAmount: 6000,
          paymentDate: moment().format('L'),
          paymentType: 'deposit',
          reference: ''
        };

        invoicePromise = Q.defer();
        invoiceStub.returns(invoicePromise.promise);
    });

    afterEach(() => {
        models.Invoice.create.restore();
        loggerStub.restore();
    });

    it("creates a new invoice", (done) => {
        invoicePromise.resolve();

        invoiceService.createInvoice(newInvoice)
            .then(() => {
                expect(Invoice.create).toHaveBeenCalledWith(expectedNewInvoice);
            }).nodeify(done);
    });
  });
});
