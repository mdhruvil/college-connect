export function parseDomainFromEmail(email: string) {
  return email.split("@").pop();
}
