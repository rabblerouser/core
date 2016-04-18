const invalidDataError = 'INVALID DATA';

const parseString = (value) => {
  if (!value) {
    throw invalidDataError;
  }
  return value;
};

const parseGroupDetails = (data) => {
  if (!data) {
    throw invalidDataError;
  }
  return {
    id: parseString(data.id),
    name: parseString(data.name),
    description: parseString(data.description),
  };
};

const parseGroups = (data) => {
  if (!data || !Array.isArray(data.groups)) {
    throw invalidDataError;
  }
  return data.groups.map(parseGroupDetails);
};

export default {
  parseGroup: parseGroupDetails,
  parseGroups,
};
