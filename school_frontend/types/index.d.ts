export type ApiResponse = {
  success: boolean;
  data?: any;
  message: string;
};

export type Admin = {
  id: string;
  username: string;
  designation: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Address = {
  street: string;
  city: string;
  area: string;
  state: string;
  country: string;
  zipCode: string;
};

enum SchoolBoard {
  CBSE = "CBSE",
  ICSE = "ICSE",
  STATE = "STATE",
  IB = "IB",
  CAMBRIDGE = "CAMBRIDGE",
}

enum SchoolType {
  PRIVATE = "Private",
  GOVERNMENT = "Government",
  AIDED = "Aided",
  INTERNATIONAL = "International",
}

enum Medium {
  ENGLISH = "English",
  HINDI = "Hindi",
  REGIONAL = "Regional",
}

export type School = {
  name: string;
  code: string;
  board: SchoolBoard;
  affiliationNumber: string;
  schoolType: SchoolType;
  contactPhone?: string | null;
  contactEmail: string | null;
  medium: Medium;
  website?: string | null;
  logoUrl?: string | null;
  address: Address;
  establishmentYear: string;
};
