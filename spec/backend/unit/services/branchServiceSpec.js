'use strict';

const specHelper = require('../../../support/specHelper'),
      sinon = specHelper.sinon,
      Branch = specHelper.models.Branch;

var branchService = require('../../../../src/backend/services/branchService');

function fakeResidentialAddress() {
    return {
        address: '221b Baker St',
        suburb: 'London',
        country: 'England',
        state: 'VIC',
        postcode: '1234'
    };
}

function fakeResidentialAddressFromDB() {
    return {
        dataValues: fakeResidentialAddress(),
        id: 1
    };
}

function fakePostalAddress() {
    return {
        address: '47 I dont want your spam St',
        suburb: 'Moriarty',
        country: 'USA',
        state: 'NM',
        postcode: '5678'
    };
}

function fakePostalAddressFromDB() {
    return {
        id: 2,
        dataValues: fakePostalAddress()
    };
}

function fakeBranchesListFromDb() {
    return [
        {
            dataValues: {
                id:1,
                name: 'Geelong',
                residentialAddress: fakeResidentialAddressFromDB(),
                postalAddress: fakePostalAddressFromDB()
            }
        },
        {
            dataValues: {
                id:2,
                name: 'Frankston',
                residentialAddress: fakePostalAddressFromDB(),
                postalAddress: null
            }
        },
        {
            dataValues: {
                id:3,
                name: 'Hawthorn',
                residentialAddress: null,
                postalAddress: null
            }
        }
    ];
}

describe('branchService', () => {
    describe('list', () => {

        beforeEach(() => {
            sinon.stub(Branch, 'findAll');
        });

        afterEach(() => {
            Branch.findAll.restore();
        });

        it('should return branches with address', (done) => {
            Branch.findAll
                .returns(Promise.resolve(fakeBranchesListFromDb()));

            branchService.list().then((result) => {
                expect(result.length).toEqual(3);
            }).then(done, done.fail);
        });

        it('should return branches with no address');
        it('should return all the available branches');
    });

});
