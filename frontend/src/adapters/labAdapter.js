const invalidDataError = 'INVALID DATA';

const parseString = value => {
  if (!value) {
    throw invalidDataError;
  }
  return value;
};

const parseLabDetails = data => {
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

const parseLabs = data => {
  if (!data || !Array.isArray(data.branches)) {
    throw invalidDataError;
  }
  return data.branches.map(parseLabDetails);
};

export default {
  parseLab: parseLabDetails,
  parseLabs,
};
