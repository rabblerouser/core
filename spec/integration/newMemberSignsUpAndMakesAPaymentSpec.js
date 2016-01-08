'use strict';

var request = require("supertest-as-promised");

const instance_url = process.env.INSTANCE_URL,
      specHelper = require("../support/specHelper");

it ("a new member successfully signs up and then makes a payment", (done) => {
    let app,
        memberSuffix;

    let successfullyCreatingANewMemberShouldRepondWithA200 = () => {
        return request(app)
            .post("/members")
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .send(member)
            .expect(200, {});
    };

    let successfullyCreatingANewInvoiceShouldRespondWithA200 = () => {
        return request(app)
            .post("/invoices")
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .send(invoice)
            .expect(200, {});
    };

    if (instance_url) {
        app = instance_url;
        memberSuffix = Date.now();
    }
    else {
        app = require("../../app");
        memberSuffix = "";
    }

    let member = {
        "firstName": "Sherlock",
        "lastName": "Holmes",
        "email": `sherlock${memberSuffix}@holmes.co.uk`,
        "dateOfBirth": "22/12/1900",
        "primaryPhoneNumber": "0396291146",
        "secondaryPhoneNumber": null,
        "gender": "horse radish",
        "residentialAddress": {
            "address": "222b Baker St",
            "suburb": "London",
            "country": "England",
            "state": "VIC",
            "postcode": "12<script>var potato=true;</script>34"
        },
        "postalAddress": {
            "address": "303 collins st",
            "suburb": "melbourne",
            "country": "australia",
            "state": "VIC",
            "postcode": "3000"
        }
    };

    let invoice = {
        "memberEmail": `sherlock${memberSuffix}@holmes.co.uk`,
        "totalAmount": "88.88",
        "paymentType": "deposit"
    };

    successfullyCreatingANewMemberShouldRepondWithA200()
        .then(successfullyCreatingANewInvoiceShouldRespondWithA200)
        .nodeify(done)
        .catch((err) => {
            done.fail(err);
        });
}, 20000);
