import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const teamSchema = yup.object().shape({
  name: yup
    .string()
    .required("Team name is required")
    .min(2, "Team name must be at least 2 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(5, "Description must be at least 5 characters"),
  code: yup.string().required("Team code is required"),
  isActive: yup.boolean().required("Status is required"),
});

export const userSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^\+\d{10,15}$/, "Invalid phone number format"),
  team: yup.object().shape({
    id: yup.string().required("Team is required"),
  }),
});

export const meetingSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(5, "Description must be at least 5 characters"),
  googleMeetId: yup
    .string()
    .required("Google Meet ID is required")
    .matches(/^[a-z0-9-]+$/, "Invalid Google Meet ID format"),
  teamId: yup.number().required("Team is required"),
  organizerId: yup.number().required("Organizer is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),
});
