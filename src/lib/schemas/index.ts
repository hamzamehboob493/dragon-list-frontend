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
