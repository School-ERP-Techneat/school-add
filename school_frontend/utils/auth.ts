export const logoutUser = () => {
  document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  window.location.href = '/login';
};
