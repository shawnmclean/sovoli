export const createEnumObject = <T extends readonly [string, ...string[]]>(
  values: T,
): Record<T[number], T[number]> => {
  const obj: Record<string, T[number]> = {};
  for (const value of values) {
    obj[value] = value;
  }
  return obj;
};
