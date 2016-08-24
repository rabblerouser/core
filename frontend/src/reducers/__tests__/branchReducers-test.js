import reducer from '../branchReducers.js';

describe('branchReducers', () => {
  describe('DEFAULT', () => {
    it('sets empty branches, selectedBranch, editedBranch and isEditing false by default', () => {
      const action = { type: '' };
      const reduction = reducer(undefined, action);
      expect(reduction).toEqual({
        availableBranches: [],
        selectedBranch: '',
        editedBranch: '',
        isEditing: false,
      });
    });
  });

  describe('BRANCH_LIST_UPDATED', () => {
    it('attaches the branch and selectedBranch to the state', () => {
      const action = {
        type: 'BRANCH_LIST_UPDATED',
        branches: ['a'],
        selectedBranch: '121',
      };
      const reduction = reducer({}, action);
      expect(reduction).toEqual({ availableBranches: ['a'], selectedBranch: '121' });
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
    it('appends the provided branch to the existing branch list', () => {
      const initialState = { availableBranches: [{ id: '001' }] };
      const action = {
        type: 'BRANCH_CREATED',
        branch: { id: '002' },
      };
      const reduction = reducer(initialState, action);
      expect(reduction.availableBranches).toEqual([{ id: '001' }, { id: '002' }]);
    });

    it('selects the newly created branch', () => {
      const initialState = { availableBranches: [{ id: '001' }], selectedBranch: { id: '001' } };
      const action = {
        type: 'BRANCH_CREATED',
        branch: { id: '002' },
      };
      const reduction = reducer(initialState, action);
      expect(reduction.selectedBranch).toEqual('002');
    });
  });

  describe('BRANCH_UPDATED', () => {
    it('replaces the entry for the existing branch', () => {
      const initialState = { availableBranches: [{ id: '001', some: 'data' }] };
      const action = {
        type: 'BRANCH_UPDATED',
        branch: { id: '001', some: 'otherData' },
      };
      const reduction = reducer(initialState, action);
      expect(reduction.availableBranches).toEqual([{ id: '001', some: 'otherData' }]);
    });
  });

  describe('BRANCH_REMOVED', () => {
    it('removes the entry for the provided branch', () => {
      const initialState = { availableBranches: [{ id: '001' }] };
      const action = {
        type: 'BRANCH_REMOVED',
        branchId: '001',
      };
      const reduction = reducer(initialState, action);
      expect(reduction.availableBranches).toEqual([]);
    });

    it('selects the first branch in the list after removing the branch', () => {
      const initialState = {
        availableBranches: [{ id: '001' }, { id: '002' }],
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

  describe('EDIT_BRANCH', () => {
    it('sets isEditing to true and sets the edited branch as the selected branch', () => {
      const initialState = { selectedBranch: { id: '001' } };
      const action = { type: 'EDIT_BRANCH' };
      const reduction = reducer(initialState, action);
      expect(reduction).toEqual({ isEditing: true, selectedBranch: { id: '001' }, editedBranch: { id: '001' } });
    });
  });

  describe('ADD_BRANCH', () => {
    it('sets isEditing to true and sets the edited branch as the empty', () => {
      const initialState = { editedBranch: { id: '001' } };
      const action = { type: 'ADD_BRANCH' };
      const reduction = reducer(initialState, action);
      expect(reduction).toEqual({ isEditing: true, editedBranch: '' });
    });
  });

  describe('FINISH_EDIT_BRANCH', () => {
    it('sets isEditing to false and sets the edited branch as the empty', () => {
      const initialState = { isEditing: true, editedBranch: { id: '001' } };
      const action = { type: 'FINISH_EDIT_BRANCH' };
      const reduction = reducer(initialState, action);
      expect(reduction).toEqual({ isEditing: false, editedBranch: '' });
    });
  });
});
