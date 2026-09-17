export const toast = (message) => {
  window.dispatchEvent(new CustomEvent('toast', { detail: { message } }));
};
