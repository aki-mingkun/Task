export const getToken = () => {
  return JSON.parse(localStorage.getItem('tokens')) || {};
};

export const setToken = (tokens) => {
  localStorage.setItem('tokens', JSON.stringify(tokens));
};

export const clearToken = () => {
  localStorage.removeItem('tokens');
};

export const logout = () => {
  clearToken();
};
