const invalidDataError = 'INVALID DATA';

const parseAdminDetails = data => {
  if (!data || !data.id) {
    throw invalidDataError;
  }
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    phoneNumber: data.phoneNumber,
  };
};

const parseAdmins = data => {
  if (!data || !Array.isArray(data.admins)) {
    throw invalidDataError;
  }
  return data.admins.map(parseAdminDetails);
};

export default {
  parseAdminDetails,
  parseAdmins,
};
