export function isValidString(str: string | null | undefined): str is string {
  return str != null && str.trim() !== '';
}
