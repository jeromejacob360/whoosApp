export const encodeEmail = (email) => email.replaceAll('.', '!!');
export const decodeEmail = (email) => email.replaceAll('!!', '.');

export const chatNameGenerator = (email1, email2) => {
  if (email1 && email2) return [email1, email2].sort().join('');
};

export const textTrimmer = (text, limit = 20) =>
  text.length > limit ? text.substring(0, limit) + '...' : text;
