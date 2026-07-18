export interface CompanyContact {
  id: string;
  name: string;
  phone: string;
}

// Naya company add karna ho to bas yahan ek entry add karein
export const COMPANY_CONTACTS: CompanyContact[] = [
  { id: "company-1", name: "Company 1", phone: "03449004156" },
  { id: "company-2", name: "Company 2", phone: "03111292746" },
  { id: "company-3", name: "Company 3", phone: "03233225917" },
];