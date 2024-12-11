export const pluralize = (
  count: number,
  singular: string,
  plural = `${singular}s`,
) => {
  if (count === 1) return singular;
  return plural;
};
