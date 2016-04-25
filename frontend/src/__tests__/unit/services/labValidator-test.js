import labValidator from '../../../services/labValidator';

describe('labValidator', () => {
  describe('isValid', () => {
    const validLab = { name: 'Valid lab' };

    it('should return empty array of errors on valid lab', () => {
      expect(labValidator.isValid(validLab)).toEqual([]);
    });

    it('should return array of errors on null lab', () => {
      expect(labValidator.isValid(null).length).not.toBe(0);
    });

    it('should return array of errors when missing data', () => {
      const invalidLab = {};
      const expectedErrors = ['name'];
      expect(labValidator.isValid(invalidLab)).toEqual(expectedErrors);
    });
  });
});
