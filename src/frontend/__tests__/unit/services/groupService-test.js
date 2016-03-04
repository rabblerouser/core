'use strict';
import groupService from '../../../services/groupService';

describe('groupService', () => {

    describe('createOrUpdateGroup', () => {

        describe('when the group provided has no id but is valid', () => {

            it('should send a request to save a new group for the branch', () => {

            });

        });

        describe('when the group provided has an id and is valid', () => {

            it('should send a request to save a new group for the branch', () => {

            });

        });

        describe('when the group provided is not valid', () => {


        });

        describe('when the remote rejects the request', () => {

            describe('with a 500 server error', () => {
                it('should return a general server error', (done) => {
                    done();
                });
            });

            describe('with a 401 unauthorised error', () => {

                it('should return an error that the remote endpoint was not found', (done) => {
                    done();
                });
            });

            describe('with a 404 not found error', () => {
                it('should return an error that the remote endpoint was not found', (done) => {
                    done();
                });
            });

        });


    });


});
