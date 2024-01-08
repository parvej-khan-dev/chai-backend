const haveValue = (value) => {
  if (
    value === null &&
    value === "null" &&
    value === undefined &&
    value === "undefined" &&
    value === 0 &&
    value === ""
  ) {
    return false;
  }
  return true;
};



export {
    haveValue
}