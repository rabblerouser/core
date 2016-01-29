'use strict';

const queryString = require('query-string');
const specHelper = require('../../support/specHelper'),
      sinon = specHelper.sinon,
      Q = specHelper.Q,
      paypalHandler = require('../../../lib/paypalHandler.js'),
      invoiceService = require('../../../services/invoiceService.js'),
      paypalIpn = require('paypal-ipn'),
      logger = require('../../../lib/logger');

xdescribe('paypalHandler', () => {
    let ipnStub, req, res, chargeSuccessStub, statusStub, endStub,
    invalidRequestLoggerStub, paypalVerifyFailedLoggerStub, chargeSuccesPromise;
    let receiverEmail = paypalHandler.getPaypalEmail();
    const data = 'residence_country=US&invoice=abc1234&addre_city=San+Jose&first_name=John&payer_id=TESTBUYERID01&mc_fee=0.44&txn_id=421462822&receiver_email='+receiverEmail+'&custom=xyz123+CUSTOMHASH&payment_date=12%3A40%3A25+27+Aug+2013+PDT&address_country_code=US&address_zip=95131&item_name1=something&mc_handling=2.06&mc_handling1=1.67&tax=2.02&address_name=John+Smith&last_name=Smith&receiver_id=seller%40paypalsandbox.com&verify_sign=AFcWxV21C7fd0v3bYYYRCpSSRl31AgAAjEU7A5rthY2aP4j1jOIrjuGx&address_country=United+States&payment_status=Completed&address_status=confirmed&business=seller%40paypalsandbox.com&payer_email=buyer%40paypalsandbox.com&notify_version=2.4&txn_type=cart&payer_status=unverified&mc_currency=USD&mc_gross=12.34&mc_shipping=3.02&mc_shipping1=1.02&item_number1=AK-1234&address_state=CA&mc_gross1=9.34&payment_type=instant&address_street=123%2C+any+street' ;

    beforeEach(() => {
        ipnStub = sinon.stub(paypalIpn, 'verify');
        chargeSuccessStub = sinon.stub(invoiceService, 'paypalChargeSuccess');
        invalidRequestLoggerStub = sinon.stub(logger, 'invalidPaypalIpnRequest');
        paypalVerifyFailedLoggerStub = sinon.stub(logger, 'paypalVerifyFailed');
        statusStub = sinon.stub().returns({});
        endStub = sinon.stub().returns({});
        req = {body: queryString.parse(data)};
        res = {sendStatus: statusStub};
        chargeSuccesPromise = Q.defer();
        chargeSuccessStub.returns(chargeSuccesPromise.promise);
    });

    afterEach(() => {
        ipnStub.restore();
        chargeSuccessStub.restore();
        invalidRequestLoggerStub.restore();
        paypalVerifyFailedLoggerStub.restore();
    });

    it('Should call charge success if verify returns no errors', (done) => {
        ipnStub.yields(null, res);
        chargeSuccesPromise.resolve();

        paypalHandler.handleIpn(req, res);

        chargeSuccesPromise.promise.finally( () => {
            expect(chargeSuccessStub).toHaveBeenCalled();
            expect(invalidRequestLoggerStub).not.toHaveBeenCalled();
            expect(res.sendStatus).toHaveBeenCalledWith(200);
        }).nodeify(done);
    });

    it('Should not call charge success if verify returns errors', () => {
        ipnStub.yields(new Error('IPN Verification status: ' + res));

        paypalHandler.handleIpn(req, res);

        expect(chargeSuccessStub).not.toHaveBeenCalled();
        expect(invalidRequestLoggerStub).not.toHaveBeenCalled();
        expect(paypalVerifyFailedLoggerStub).toHaveBeenCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(400);
    });

    it('Should not call charge success if payment_status is not completed', () => {
        const data = 'residence_country=US&invoice=abc1234&addre_city=San+Jose&first_name=John&payer_id=TESTBUYERID01&mc_fee=0.44&txn_id=421462822&receiver_email='+receiverEmail+'&custom=xyz123+CUSTOMHASH&payment_date=12%3A40%3A25+27+Aug+2013+PDT&address_country_code=US&address_zip=95131&item_name1=something&mc_handling=2.06&mc_handling1=1.67&tax=2.02&address_name=John+Smith&last_name=Smith&receiver_id=seller%40paypalsandbox.com&verify_sign=AFcWxV21C7fd0v3bYYYRCpSSRl31AgAAjEU7A5rthY2aP4j1jOIrjuGx&address_country=United+States&payment_status=Pending&address_status=confirmed&business=seller%40paypalsandbox.com&payer_email=buyer%40paypalsandbox.com&notify_version=2.4&txn_type=cart&payer_status=unverified&mc_currency=USD&mc_gross=12.34&mc_shipping=3.02&mc_shipping1=1.02&item_number1=AK-1234&address_state=CA&mc_gross1=9.34&payment_type=instant&address_street=123%2C+any+street' ;
        req = {body: queryString.parse(data)};

        ipnStub.yields(null, res);

        paypalHandler.handleIpn(req, res);

        expect(chargeSuccessStub).not.toHaveBeenCalled();
        expect(invalidRequestLoggerStub).toHaveBeenCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(400);
    });


    it('Should not call charge success if email is different to one in config', () => {
        let anotherEmail = 'someOther@email.com';
        const data = 'residence_country=US&invoice=abc1234&addre_city=San+Jose&first_name=John&payer_id=TESTBUYERID01&mc_fee=0.44&txn_id=421462822&receiver_email='+anotherEmail+'&custom=xyz123+CUSTOMHASH&payment_date=12%3A40%3A25+27+Aug+2013+PDT&address_country_code=US&address_zip=95131&item_name1=something&mc_handling=2.06&mc_handling1=1.67&tax=2.02&address_name=John+Smith&last_name=Smith&receiver_id=seller%40paypalsandbox.com&verify_sign=AFcWxV21C7fd0v3bYYYRCpSSRl31AgAAjEU7A5rthY2aP4j1jOIrjuGx&address_country=United+States&payment_status=Completed&address_status=confirmed&business=seller%40paypalsandbox.com&payer_email=buyer%40paypalsandbox.com&notify_version=2.4&txn_type=cart&payer_status=unverified&mc_currency=USD&mc_gross=12.34&mc_shipping=3.02&mc_shipping1=1.02&item_number1=AK-1234&address_state=CA&mc_gross1=9.34&payment_type=instant&address_street=123%2C+any+street' ;
        req = {body: queryString.parse(data)};

        ipnStub.yields(null, res);

        paypalHandler.handleIpn(req, res);

        expect(chargeSuccessStub).not.toHaveBeenCalled();
        expect(invalidRequestLoggerStub).toHaveBeenCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(400);
    });
});
