import { Environment } from "nunjucks";
import { map, orderBy, take, uniqBy, get, partial, groupBy } from "lodash";
import {
  calculateProperty,
  filterBy,
  formatArray,
  formatArrayObject,
  formatNumber,
  formatObject,
  formatString,
  formatTable,
  rejectBy,
  relativeDateRangeToFixed,
  relativeDateRangeToFixedArray,
  relativeDateToFixed,
  renderMoodEmoji,
  safePercentage,
} from "./filters";

export function registerFilters(nj: Environment): Environment {
  nj.addFilter("encodeURIComponent", encodeURIComponent);
  nj.addFilter("relativeDateToFixed", relativeDateToFixed);
  nj.addFilter("relativeDateRangeToFixedArray", relativeDateRangeToFixedArray);
  nj.addFilter("relativeDateRangeToFixed", relativeDateRangeToFixed);
  nj.addFilter("formatString", formatString);
  nj.addFilter("formatNumber", formatNumber);
  nj.addFilter("formatObject", partial(formatObject, nj));
  nj.addFilter("formatArrayObject", partial(formatArrayObject, nj));
  nj.addFilter("formatArray", partial(formatArray, nj));
  nj.addFilter("filterBy", partial(filterBy, nj));
  nj.addFilter("rejectBy", partial(rejectBy, nj));
  nj.addFilter("safePercentage", safePercentage);
  nj.addFilter("renderMoodEmoji", renderMoodEmoji);
  nj.addFilter("calculateProperty", partial(calculateProperty, nj));
  nj.addFilter("get", get);
  nj.addFilter("map", map);
  nj.addFilter("take", take);
  nj.addFilter("orderBy", orderBy);
  nj.addFilter("uniqBy", uniqBy);
  nj.addFilter("groupBy", groupBy);
  nj.addFilter("formatTable", formatTable);

  return nj;
}
