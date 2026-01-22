const countryEduDomainMap: Record<string, string[]> = {
  GY: [".edu.gy"],
  JM: [".edu.jm"],
  UK: [".ac.uk", ".sch.uk"],
  US: [".edu"],
};

export function matchCountrySuffix({
  values,
  countryCode,
}: {
  values: string[];
  countryCode: string;
}): {
  matched: boolean;
  matchedValue?: string;
  expected: string[];
} {
  const cc = countryCode.toUpperCase();
  const expected = countryEduDomainMap[cc] ?? [];

  for (const val of values) {
    for (const suffix of expected) {
      if (val.toLowerCase().endsWith(suffix)) {
        return {
          matched: true,
          matchedValue: val,
          expected,
        };
      }
    }
  }

  return {
    matched: false,
    expected,
  };
}
