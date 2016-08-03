import branchValidator from '../branchValidator';

describe('branchValidator', () => {
  describe('isValid', () => {
    const validBranch = { name: 'Valid branch' };

    it('should return empty array of errors on valid branch', () => {
      expect(branchValidator.isValid(validBranch)).toEqual([]);
    });

    it('should return array of errors on null branch', () => {
      expect(branchValidator.isValid(null).length).not.toBe(0);
    });

    it('should return array of errors when missing data', () => {
      const invalidBranch = {};
      const expectedErrors = ['name'];
      expect(branchValidator.isValid(invalidBranch)).toEqual(expectedErrors);
    });
  });
});
