const COOKIE_NAME = "cat-admin-token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const saveToken = (token) => {
  localStorage.setItem("catAdmin", token);
  if (typeof document !== "undefined") {
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
      token
    )}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  }
};

export const getToken = () => {
  return localStorage.getItem("catAdmin");
};

export const removeToken = () => {
  localStorage.removeItem("catAdmin");
  localStorage.removeItem("adminLoginId");
  if (typeof document !== "undefined") {
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  }
};

export const isAuthenticated = () => {
  return !!getToken();
};
