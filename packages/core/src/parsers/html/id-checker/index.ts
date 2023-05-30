export const extractId = (name: string) => {
  const regex = /^::(.*)/gm;
  const match = regex.exec(name);
  return match == null ? null : match[1];
};
