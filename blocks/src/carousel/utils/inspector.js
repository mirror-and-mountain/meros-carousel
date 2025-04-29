export const hasCustomValue = (val, defaultVal) => {
  // Handle array comparison
  if (Array.isArray(val) && Array.isArray(defaultVal)) {
      if (val.length !== defaultVal.length) return true;

      const sortedVal = [...val].sort();
      const sortedDefault = [...defaultVal].sort();

      return !sortedVal.every((item, index) => item === sortedDefault[index]);
  }

  // Non-array comparison
  return val !== undefined && val !== defaultVal;
};
