export default (elt) => {
  const {
    style,
    offsetHeight,
    clientHeight,
    scrollHeight,
  } = elt;
  const offset = offsetHeight - clientHeight;
  style.height = `${scrollHeight - offset}px`;
};
