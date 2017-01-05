import { branches, progress, getBranches, getProgress } from '../reducers';

describe('signup app reducers', () => {
  describe('branches', () => {
    it('returns an empty array by default', () => {
      const reduction = branches(undefined, { type: 'SOME_UNKNOWN_ACTION' });
      expect(reduction).toEqual([]);
    });

    it('returns an array of branches when BRANCH_LIST_UPDATED', () => {
      const reduction = branches(undefined, { type: 'BRANCH_LIST_UPDATED', payload: { branches: [{ id: 1234 }] } });
      expect(reduction).toEqual([{ id: 1234 }]);
    });
  });

  describe('progress', () => {
    it('returns the number 0 by default', () => {
      const reduction = progress(undefined, { type: 'SOME_UNKNOWN_ACTION' });
      expect(reduction).toEqual(0);
    });

    it('returns the number 1 when REGISTER_START', () => {
      const reduction = progress(undefined, { type: 'REGISTER_START' });
      expect(reduction).toEqual(1);
    });

    it('returns the number 2 when REGISTER_SUCCESS', () => {
      const reduction = progress(undefined, { type: 'REGISTER_SUCCESS' });
      expect(reduction).toEqual(2);
    });
  });
});

describe('signup app selectors', () => {
  describe('getBranches', () => {
    it('returns undefined when there are no branches', () => {
      expect(getBranches({})).toEqual(undefined);
    });

    it('returns the branches from state when they exist', () => {
      expect(getBranches({ branches: [{ id: '1234' }] })).toEqual([{ id: '1234' }]);
    });
  });
  describe('getProgress', () => {
    it('returns undefined when there is no progress', () => {
      expect(getProgress({})).toEqual(undefined);
    });

    it('returns the progress when it exists', () => {
      expect(getProgress({ progress: 1 })).toEqual(1);
    });
  });
});
