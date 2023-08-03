let token;

export const setToken = (userToken) => {
  console.log(userToken);
  token = userToken;
};

export const getToken = () => {
  console.log(token);
  return token;
};

export const deleteToken = () => {
  token = null;
};
