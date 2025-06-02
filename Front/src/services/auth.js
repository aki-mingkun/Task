export const getToken = () => {
  return JSON.parse(localStorage.getItem('tokens')) || {};
};

export const setToken = (tokens) => {
  // Lưu cả username vào localStorage cho các request sau này
  if (tokens && tokens.username) {
    localStorage.setItem('username', tokens.username);
  }
  localStorage.setItem('tokens', JSON.stringify(tokens));
};

export const clearToken = () => {
  localStorage.removeItem('tokens');
  localStorage.removeItem('username');
};

export const logout = () => {
  clearToken();
};
