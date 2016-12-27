import { isEditing, editedBranch } from '../reducers.js';

describe('branchView / reducers', () => {
  describe('isEditing', () => {
    it('defaults to false', () => {
      const reduction = isEditing(undefined, { type: '' });
      expect(reduction).toEqual(false);
    });

    it('is set to true upon EDIT_BRANCH ', () => {
      const reduction = isEditing(false, { type: 'EDIT_BRANCH' });
      expect(reduction).toEqual(true);
    });

    it('is set to true upon ADD_BRANCH ', () => {
      const reduction = isEditing(false, { type: 'ADD_BRANCH' });
      expect(reduction).toEqual(true);
    });

    it('is set to false upon FINISH_EDIT_BRANCH ', () => {
      const reduction = isEditing(true, { type: 'FINISH_EDIT_BRANCH' });
      expect(reduction).toEqual(false);
    });
  });

  describe('editedBranch', () => {
    it('defaults to an empty object', () => {
      const reduction = editedBranch(undefined, { type: '' });
      expect(reduction).toEqual({});
    });

    it('is set to the provided branch upon EDIT_BRANCH', () => {
      const reduction = editedBranch({}, { type: 'EDIT_BRANCH', branch: { id: 1234 } });
      expect(reduction).toEqual({ id: 1234 });
    });

    it('is set to an empy object upon FINISH_EDIT_BRANCH', () => {
      const reduction = editedBranch({ id: 1234 }, { type: 'FINISH_EDIT_BRANCH' });
      expect(reduction).toEqual({});
    });
  });
});
