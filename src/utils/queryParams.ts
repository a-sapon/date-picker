export const queryParams = new URLSearchParams(window.location.search);

export const updateQueryParams = () => {
  const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
  window.history.replaceState(null, "", newUrl);
};
