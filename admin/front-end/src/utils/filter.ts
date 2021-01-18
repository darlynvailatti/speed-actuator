export function useDefaultIfIsNone(value: any, defaultValue: any) {
  if (!value) return defaultValue;
  else return value;
}
