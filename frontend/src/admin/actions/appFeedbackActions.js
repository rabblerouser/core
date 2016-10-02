export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
export const REPORT_FAILURE = 'REPORT_FAILURE';
export const REPORT_SUCCESS = 'REPORT_SUCCESS';

export const clearMessages = () => (
  {
    type: CLEAR_MESSAGES,
  }
);

export const reportFailure = message => (
  {
    type: REPORT_FAILURE,
    message,
  }
);

export const reportSuccess = message => (
  {
    type: REPORT_SUCCESS,
    message,
  }
);
