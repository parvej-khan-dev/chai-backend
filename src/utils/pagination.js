import { haveValue } from "./helpers";

const paginateOption = (
  page = 1,
  limit = 10,
  { field, select } = null,
  { sortBy, sortType } = null
) => {
  let options = {
    page,
    limit,
    lean: true,
  };

  if (haveValue(field) && haveValue(select)) {
    options.populate = {
      path: field,
      select: select,
    };
  }

  if (haveValue(sortBy) && haveValue(sortType)) {
    options.sort = {
      [sortBy]: sortType, // its can be 1 && -1 ASE AND ASE
    };
  }
  return options;
};

export { paginateOption };
