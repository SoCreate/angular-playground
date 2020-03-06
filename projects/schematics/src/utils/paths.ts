export const constructPath = (parts: string[], isAbsolute = false) => {
  const filteredParts = parts.filter(part => !!part);
  return `${isAbsolute ? '/' : ''}${filteredParts.join('/')}`;
};
