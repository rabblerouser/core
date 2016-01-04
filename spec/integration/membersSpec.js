'use strict';

var request = require("supertest");

const instance_url = process.env.INSTANCE_URL,
      specHelper = require("../support/specHelper");

describe("/members", () => {
    describe("POST", () => {
        let app,
            memberSuffix;

        beforeEach(() => {
            if (instance_url) {
                app = instance_url;
                memberSuffix = Date.now();
            }
            else {
                app = require("../../app");
                memberSuffix = "";
            }
        });

        it("signs up a valid member", (done) => {
            let member = {
                "firstName": "Sherlock",
                "lastName": "Holmes",
                "email": `sherlock${memberSuffix}@holmes.co.uk`,
                "dateOfBirth": "22 December 1900",
                "phoneNumber": "0396291146",
                "residentialAddress": {
                    "address": "222b Baker St",
                    "suburb": "London",
                    "country": "England",
                    "state": "VIC",
                    "postcode": "1234"
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
                .expect(200, null)
                .end(finishSupertest(done));
        }, 10000);
    });
});
