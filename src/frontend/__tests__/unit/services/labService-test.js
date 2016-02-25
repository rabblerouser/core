'use strict';
import labService from '../../../services/labService';

describe('labService', () => {

  describe('getLabList', () => {

    describe('when the remote labs are successfully retreived', () => {
      it('should return a list of the labs', (done) => {
        let labs = labService.getLabList();
        labs.then( (list) => {
          expect(list).toEqual([{key: '1', value: 'Geelong'}, {key: '2', value: 'Melbourne'}, {key: '3', value: 'East Melbourne'}]);
        })
        .then(done, done.fail);
      });
    });

  });

});
