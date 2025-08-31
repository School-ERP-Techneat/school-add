import * as z from "zod";
export const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zipCode: z.string(),
});

export const schoolSchema = z.object({
  name: z.string(),
  code: z.string().optional(),
  affiliationNumber: z.string(),
  board: z.enum(["CBSE", "ICSE", "STATE", "IB", "CAMBRIDGE"]),
  medium: z.enum(["English", "Hindi", "Regional"]),
  establishmentYear: z.string().max(4).min(4),
  schoolType: z.enum(["Private", "Government", "Aided", "International"]),
  contactPhone: z
    .string()
    .length(10, "Phone must be 10 digits")
    .optional()
    .nullable(), // allows null
  contactEmail: z.email("Invalid email").optional().nullable(),

  website: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  address: addressSchema,
});

export const adminSchema = z.object({
  username: z.string().min(4),
  password: z.string().min(6).optional().nullable(),
  designation: z.string(),
  schoolCode: z.string().min(3),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  locationCode: z.string(),
});
