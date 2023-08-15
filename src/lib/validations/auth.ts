import * as z from "zod";
import { toTypedSchema } from "@vee-validate/zod";

const zodObj = {
  name: z
  .string({ required_error: "Name is required", })
  .min(2, 'Name should have at least 2 alphabets')
  .refine((value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value), 'Name should contain only alphabets'),
  // .refine((value) => /^[a-zA-Z]+\s+[a-zA-Z]+$/.test(value), 'Please enter both firstname and lastname')

  username: z
  .string({ required_error: "Username is required" })
  .min(5, 'Username should have at least 5 character')
  .refine((value) => /^[A-Za-z][A-Za-z0-9_]{4,29}$/.test(value), 'Username is invalid'),

  email: z
  .string({ required_error: 'Email is required' })
  .email({ message: 'Email is invalid' })
  .refine((value) => /^[\w-]{3,}@.*$/.test(value), 'name email ( before @ ) should have at least 3 character'),

  password: z
  .string({ required_error: 'Password is required' })
  .refine((value) => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^.&*-]).{8,}$/.test(value),
    'Password must has at least 8 characters that include at least 1 lowercase character, 1 uppercase characters, 1 number, and 1 special character in (!@#$%^&*)'),

  dob: z.string({ required_error: 'Date of birth is required', invalid_type_error: 'Date of birth is required' })
}

export const validationRegisterSchema = toTypedSchema(
  z.object(zodObj)
);

const { email, password } = zodObj
export const validationLoginSchema = toTypedSchema(
  z.object({ email, password })
);
