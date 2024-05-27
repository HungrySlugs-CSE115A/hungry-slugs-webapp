// Manage the user's login token
let token: string | null = null;

export const setToken = (newToken: string) => {
  token = newToken;
};

export const getToken = (): string | null => {
  return token;
};

export const isTokenNull = (): boolean => {
  return token === null;
};

export const removeToken = () => {
  token = null;
};
