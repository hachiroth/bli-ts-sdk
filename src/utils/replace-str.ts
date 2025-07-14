export function replaceStr(str: string, source: string, target: string) {
  if (!source || !str.includes(source)) return str;
  return str.split(source).join(target);
}
