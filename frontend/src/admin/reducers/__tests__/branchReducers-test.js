import reducer, { getCanSelectBranch } from '../branchReducers.js';

describe('branchReducers', () => {
  describe('DEFAULT', () => {
    it('sets availableBranch as an array and selectedBranch as a string by default', () => {
      const action = { type: '' };
      const reduction = reducer(undefined, action);
      expect(reduction).toEqual({
        availableBranches: [],
        selectedBranch: '',
      });
    });
  });

  describe('BRANCH_LIST_UPDATED', () => {
    it('attaches the branch and selectedBranch to the state', () => {
      const action = {
        type: 'BRANCH_LIST_UPDATED',
        branches: ['a'],
      };
      const reduction = reducer({}, action);
      expect(reduction).toEqual({ availableBranches: ['a'] });
    });
  });

  describe('BRANCH_SELECTED', () => {
    it('sets the selected branch as the provided id', () => {
      const action = {
        type: 'BRANCH_SELECTED',
        branchId: '121',
      };
      const reduction = reducer({}, action);
      expect(reduction).toEqual({ selectedBranch: '121' });
    });
  });

  describe('BRANCH_CREATED', () => {
    it('sets the created branch as the provided branch id', () => {
      const initialState = { selectedBranch: '999' };
      const action = {
        type: 'BRANCH_CREATED',
        branch: { id: '002' },
      };
      const reduction = reducer(initialState, action);
      expect(reduction).toEqual({ selectedBranch: '002' });
    });
  });

  describe('BRANCH_REMOVED', () => {
    it('selects the first branch in the list after removing the branch', () => {
      const initialState = {
        availableBranches: [{ id: '001' }],
        selectedBranch: '002',
      };
      const action = {
        type: 'BRANCH_REMOVED',
        branchId: '002',
      };
      const reduction = reducer(initialState, action);
      expect(reduction).toEqual({ availableBranches: [{ id: '001' }], selectedBranch: '001' });
    });

    it('selects no branch when there is no branch available after removing the branch', () => {
      const initialState = {
        availableBranches: [{ id: '001' }],
        selectedBranch: '001',
      };
      const action = {
        type: 'BRANCH_REMOVED',
        branchId: '001',
      };
      const reduction = reducer(initialState, action);
      expect(reduction.selectedBranch).toEqual('');
    });
  });
});

describe('branch selectors', () => {
  describe('getCanSelectBranch', () => {
    it('is false when there are no available branches', () => {
      expect(getCanSelectBranch({ branches: { availableBranches: [] } })).toEqual(false);
    });

    it('is false when there is 1 available branch', () => {
      expect(getCanSelectBranch({ branches: { availableBranches: ['b1'] } })).toEqual(false);
    });

    it('is true when there are 2 available branches', () => {
      expect(getCanSelectBranch({ branches: { availableBranches: ['b1', 'b2'] } })).toEqual(true);
    });
  });
});
