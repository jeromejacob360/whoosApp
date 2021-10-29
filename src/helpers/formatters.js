export const encodeEmail = (email) => email.replaceAll(".", "!!");
export const decodeEmail = (email) => email.replaceAll("!!", ".");

export const chatNameGenerator = (email1, email2) =>
  [email1, email2].sort().join("");
