const invalidDataError = 'INVALID DATA';

const parseString = value => {
  if (!value) {
    throw invalidDataError;
  }
  return value;
};

const parseBranch = data => {
  if (!data) {
    throw invalidDataError;
  }
  return {
    id: parseString(data.id),
    name: parseString(data.name),
    notes: data.notes,
    contact: data.contact,
  };
};

const parseBranches = data => {
  if (!data || !Array.isArray(data.branches)) {
    throw invalidDataError;
  }
  return data.branches.map(parseBranch);
};

export default {
  parseBranch,
  parseBranches,
};
