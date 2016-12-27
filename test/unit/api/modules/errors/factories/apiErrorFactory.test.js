import ApiError from '../../../../../../src/api/modules/errors/ApiError';
import BaseError from '../../../../../../src/api/modules/errors/BaseError';
import NotFoundError from '../../../../../../src/api/modules/errors/NotFoundError';
import ValidationError from '../../../../../../src/api/modules/errors/ValidationError';

ApiError.prototype.addFieldError = jest.fn();

const MockHttpStatuses = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

jest.mock('http-status-codes', () => MockHttpStatuses);

const apiErrorFactory = require(
  '../../../../../../src/api/modules/errors/factories/apiErrorFactory'
).default;

describe('ApiErrorFactory', () => {
  describe('createFromSequelizeError()', () => {
    describe('when passed a normal error message', () => {
      it('sets the message in the API error', () => {
        const expected = 'Something went wrong.';
        const apiError = apiErrorFactory.createFromSequelizeError({
          message: expected,
        });

        expect(apiError.message).toEqual(expected);
      });
    });

    describe('when passed nested error messages', () => {
      it('adds the nested errors to the API error', () => {
        const errors = [
          {
            path: './a',
            message: 'Error A',
          },
          {
            path: './b',
            message: 'Error B',
          },
        ];

        const apiError = apiErrorFactory.createFromSequelizeError({
          errors,
          message: 'Something went wrong.',
        });

        expect(ApiError.prototype.addFieldError)
          .toHaveBeenCalledTimes(2);

        expect(ApiError.prototype.addFieldError)
          .toHaveBeenCalledWith(errors[0].path, errors[0].message);

        expect(ApiError.prototype.addFieldError)
          .toHaveBeenCalledWith(errors[1].path, errors[1].message);
      });
    });
  });

  describe('createFromBaseError()', () => {
    describe('when passed a generic Error', () => {
      it('throws a TypeError', () => {
        expect(() => {
          apiErrorFactory.createFromBaseError(new Error());
        }).toThrow(TypeError);
      });
    });

    describe('when passed an ApiError', () => {
      it('returns the error', () => {
        const expectedError = new ApiError();

        const actualError = apiErrorFactory.createFromBaseError(expectedError);

        expect(actualError).toBe(expectedError);
      });
    });

    describe('when passed a generic BaseError', () => {
      it('returns the error', () => {
        const originalError = new BaseError('Expected message.');

        const error = apiErrorFactory.createFromBaseError(originalError);

        expect(error).toBeInstanceOf(ApiError);
        expect(error.message).toEqual(originalError.message);
        expect(error.statusCode).toEqual(MockHttpStatuses.INTERNAL_SERVER_ERROR);
      });
    });

    describe('when passed a NotFoundError', () => {
      it('returns the error', () => {
        const originalError = new NotFoundError('Expected message.');

        const error = apiErrorFactory.createFromBaseError(originalError);

        expect(error).toBeInstanceOf(ApiError);
        expect(error.message).toEqual(originalError.message);
        expect(error.statusCode).toEqual(MockHttpStatuses.NOT_FOUND);
      });
    });

    describe('when passed a ValidationError', () => {
      it('returns the error', () => {
        const originalError = new ValidationError('Expected message.');

        const error = apiErrorFactory.createFromBaseError(originalError);

        expect(error).toBeInstanceOf(ApiError);
        expect(error.message).toEqual(originalError.message);
        expect(error.statusCode).toEqual(MockHttpStatuses.BAD_REQUEST);
      });
    });
  });

  describe('createFromMessage()', () => {
    it('returns an internal server error with the specified message', () => {
      const expectedMessage = 'Something went wrong.';
      const error = apiErrorFactory.createFromMessage(expectedMessage);

      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toEqual(expectedMessage);
    });
  });
});
