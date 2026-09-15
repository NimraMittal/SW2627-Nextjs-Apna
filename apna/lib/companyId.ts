// TEMPORARY: until real employer login exists, we store the company's ID
// in the browser so pages know "who" is logged in.

export function getCompanyId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("companyId");
}

export function setCompanyId(id: string) {
  localStorage.setItem("companyId", id);
}