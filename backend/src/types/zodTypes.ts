import { AttendanceStatus } from "@prisma/client";
import * as z from "zod";

export const createAdminSchema = z.object({
  email: z.string().min(4),
  password: z.string().min(6),
  designation: z.string(),
  schoolCode: z.string().min(3),
});

export const updateAdminSchema = z.object({
  email: z.string().min(6),
  designation: z.string(),
  password: z.string().optional().nullable(),
  schoolCode: z.string().min(3),
});

export const passwordChangeSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zipCode: z.string(),
});

export const createSchoolSchema = z.object({
  name: z.string(),
  code: z.string().min(3).optional(),
  affiliationNumber: z.string(),
  board: z.enum(["CBSE", "ICSE", "STATE", "IB", "CAMBRIDGE"]),
  medium: z.enum(["English", "Hindi", "Regional"]),
  establishmentYear: z.string().min(4).max(4),
  schoolType: z.enum(["Private", "Government", "Aided", "International"]),
  contactPhone: z.string().min(10).max(10).optional().nullable(),
  contactEmail: z.email().optional().nullable(),
  website: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  address: addressSchema,
});

export const createSchoolOwnerSchema = z.object({
  password: z.string().min(6),
  email: z.email(),
  locationCode: z.string(),
});

export const loginSchoolOwnerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const loginAdminSchema = z.object({
  username: z.string(),
  password: z.string(),
  schoolCode: z.string(),
});

export const createTeacherSchema = z.object({
  fullName: z.string(),
  email: z.email(),
  password: z.string().min(6),
  phone: z.string().min(10).max(10),
  designation: z.string(),
  schoolCode: z.string().min(3),
});

export const updateTeacherSchema = z.object({
  fullName: z.string(),
  email: z.email().optional(),
  password: z.string().min(6).optional(),
  phone: z.string().min(10).max(10),
  designation: z.string(),
});

export const createStudentSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  photo: z.string().url().optional(),
  sectionId: z.string(),
  batchId: z.string(),
  admissionNo: z.string(),
  schoolCode: z.string().min(3),
});

export const loginTeacherSchema = z.object({
  schoolCode: z.string().min(3),
  email: z.email(),
  password: z.string(),
});

export const createPermissionSchema = z.object({
  module: z.string(),
  can_create: z.boolean(),
  can_delete: z.boolean(),
  can_update: z.boolean(),
  can_read: z.boolean(),
  role: z.string(),
  schoolCode: z.string().min(3),
});

export const createClassSchema = z.object({
  standard: z.number(),
  schoolCode: z.string().min(3),
  batchId: z.string(),
});

export const createSectionSchema = z.object({
  room_no: z.string(),
  name: z.string(),
  classId: z.string(),
  classTeacherId: z.string(),
});

export const createBatchSchema = z.object({
  year: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  schoolCode: z.string().min(3),
});

export const roleSchema = z.object({
  name: z.string(),
  schoolCode: z.string(),
});

export const attendanceSchema = z.object({
  attendanceData: z.array(
    z.object({
      studentId: z.string(),
      status: z.nativeEnum(AttendanceStatus),
    })
  ),
});
