export const MODAL_OPENED = 'MODAL_OPENED';
export const MODAL_CLOSED = 'MODAL_CLOSED';

export const modalOpened = source => (
  {
    type: MODAL_OPENED,
    source,
  }
);

export const modalClosed = () => (
  {
    type: MODAL_CLOSED,
  }
);
