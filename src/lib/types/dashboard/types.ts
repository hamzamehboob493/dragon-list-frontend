export interface Team {
  id: number;
  name: string;
  description: string;
  code: string;
  isActive: boolean;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
  members?: [];
}

export interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeamFormValues) => void;
  team?: Team | null;
  loading: boolean;
}

export type TeamFormValues = {
  id?: string;
  name: string;
  description: string;
  code: string;
  isActive: boolean;
};

export interface UserFormValues {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  team: { id: string };
  role?: { id: string };
  status?: { id: string };
}

export interface User {
  id?: number;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  photo?: {id: string, path: string}
  role: { id: string };
  status: { id: string };
  team: { id: string; name: string; description: string; code: string; isActive: boolean };
}

export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormValues) => void;
  user?: User | null;
  loading?: boolean;
}

export interface Meeting {
  id?: number;
  title: string;
  description: string;
  googleMeetId: string;
  googleDocId: string;
  googleDriveFolderId: string;
  teamId: number;
  organizerId: number;
  startTime: string;
  endTime: string;
  status: string;
  meetingType: string;
  recurrencePattern?: string;
  recurrenceRule?: string;
  seriesId?: string;
  parentMeetingId?: number;
  originalStartTime: string;
  recurrenceEndDate?: string;
  maxOccurrences?: number;
  isException: boolean;
  participantCount: number;
  recordingUrl?: string;
}

export interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Meeting) => void;
  meeting?: Meeting | null;
  loading?: boolean;
}
