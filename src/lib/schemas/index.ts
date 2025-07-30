import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const teamSchema = yup.object().shape({
  name: yup.string()
    .required('Team name is required')
    .min(2, 'Team name must be at least 2 characters'),
  description: yup.string()
    .required('Description is required')
    .min(5, 'Description must be at least 5 characters'),
  code: yup.string()
    .required('Team code is required'),
  isActive: yup.boolean().required('Status is required')
});

export const userSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  firstName: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
  phoneNumber: yup.string().required('Phone number is required').matches(/^\+\d{10,15}$/, 'Invalid phone number format'),
  team: yup.object().shape({
    id: yup.string().required('Team is required'),
  }),
});
