import reducer from '../modalReducers';

describe('modalReducers', () => {
  describe('DEFAULT', () => {
    it('sets !isModalOpen and source as empty by default', () => {
      const action = { type: '' };
      const reduction = reducer(undefined, action);
      expect(reduction).toEqual({ isModalOpen: false, source: '' });
    });
  });

  describe('MODAL_OPENED', () => {
    it('sets isModalOpen as true and the source as the provided source', () => {
      const action = { type: 'MODAL_OPENED', source: 'add-something' };
      const reduction = reducer(undefined, action);
      expect(reduction).toEqual({ isModalOpen: true, source: 'add-something' });
    });
  });

  describe('MODAL_CLOSED', () => {
    it('sets isModalOpen as false and clears the source entry', () => {
      const action = { type: 'MODAL_CLOSED' };
      const reduction = reducer({ isModalOpen: true, source: 'add-something' }, action);
      expect(reduction).toEqual({ isModalOpen: false, source: '' });
    });
  });
});
