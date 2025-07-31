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

export const meetingSchema = yup.object().shape({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string().required('Description is required').min(5, 'Description must be at least 5 characters'),
  googleMeetId: yup.string().required('Google Meet ID is required').matches(/^[a-z0-9-]+$/, 'Invalid Google Meet ID format'),
  googleDocId: yup.string().optional(),
  googleDriveFolderId: yup.string().optional(),
  teamId: yup.number().required('Team is required'),
  organizerId: yup.number().required('Organizer is required'),
  startTime: yup.string().required('Start time is required'),//.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, 'Invalid start time format'),
  endTime: yup.string().required('End time is required'),//.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, 'Invalid end time format'),
  status: yup.string().required('Status is required').oneOf(['scheduled', 'completed', 'cancelled'], 'Invalid status'),
  meetingType: yup.string().required('Meeting type is required').oneOf(['one_time', 'recurring'], 'Invalid meeting type'),
  recurrencePattern: yup.string().when('meetingType', {
    is: 'recurring',
    then: (schema) => schema.required('Recurrence pattern is required').oneOf(['daily', 'weekly', 'monthly'], 'Invalid recurrence pattern'),
    otherwise: (schema) => schema.optional(),
  }),
  recurrenceRule: yup.string().optional(),
  seriesId: yup.string().optional(),
  parentMeetingId: yup.number().optional(),
  originalStartTime: yup.string().required(),//.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, 'Invalid original start time format'),
  recurrenceEndDate: yup.string().optional(),//.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, 'Invalid recurrence end date format'),
  maxOccurrences: yup.number().optional().min(1, 'Max occurrences must be at least 1'),
  isException: yup.boolean().required('Exception status is required'),
  participantCount: yup.number().required('Participant count is required').min(1, 'At least one participant is required'),
  recordingUrl: yup.string().required('Recording url is required').url('Invalid URL format'),
});

