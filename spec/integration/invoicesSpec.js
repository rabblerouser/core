'use strict';

var request = require("supertest");

const instance_url = process.env.INSTANCE_URL,
      specHelper = require("../support/specHelper");

describe("/invoices", () => {
    describe("POST", () => {
        let app,
            memberSuffix;

        beforeEach((done) => {
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

            request(app)
                .post("/members")
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .send(member)
                .expect(200, {})
                .end(finishSupertest(done));
        });

        it("create a valid invoice", (done) => {
            let invoice = {
              "memberEmail": `sherlock${memberSuffix}@holmes.co.uk`,
              "totalAmount": "88.88",
              "paymentType": "deposit"
            };

            request(app)
                .post("/invoices")
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .send(invoice)
                .expect(200, {})
                .end(finishSupertest(done));
        }, 20000);
    });
});
