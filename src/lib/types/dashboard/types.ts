// @/lib/types/dashboard/types.ts

export interface Role {
  id: number;
  name: string;
  __entity?: string;
}

export interface Status {
  id: number;
  name: string;
  __entity?: string;
}

export interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: Role;
  status: Status;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  team?: Team; // Optional, as it may not always be needed
}

export interface Team {
  id: number;
  name: string;
  description: string;
  code: string;
  isActive: boolean;
  createdAt: string; // API returns string, not Date
  updatedAt: string;
  deletedAt: string | null;
  members: TeamMember[];
}

// Type for the form values used in TeamModal
export interface TeamFormValues {
  name: string;
  description: string;
  code: string;
  isActive: boolean;
}

// Props for the TeamModal component
export interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeamFormValues) => void;
  loading: boolean;
  team?: Team | null;
}

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
  photo?: { id: string; path: string };
  role: { id: string, name?: string };
  status: { id: string, name?: string };
  team: {
    id: string;
    name: string;
    description: string;
    code: string;
    isActive: boolean;
  };
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
  teamId: number | undefined;
  organizerId: number | undefined;
  startTime: string;
  endTime: string;
  status: string;
  meetingType: string;
  recurrencePattern?: string;
  recurrenceRule?: string;
  seriesId?: string;
  originalStartTime: string;
  recurrenceEndDate?: string;
  maxOccurrences?: number;
  isException: boolean;
  participantCount: number;
  recordingUrl?: string;
  team?: Team;
  organizer?: User;
}

export interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Meeting) => void;
  meeting?: Meeting | null;
  loading?: boolean;
}

export interface WhatsappMessagesPageProps {
  id: number;
  whatsappMessageId: string;
  fromNumber: string;
  toNumber: string;
  fromName: string;
  messageType: string;
  content: string;
  status: string;
  timestamp: string;
  mediaUrl: string | null;
  mediaType: string | null;
  mediaCaption: string | null;
  containsActionItems: boolean;
  containsQuestions: boolean;
  containsDecisions: boolean;
  contentCategory: string;
  contextCategory: string;
  isGroupMessage: boolean;
  groupName: string | null;
  groupId: string | null;
  createdAt: string;
  updatedAt: string;
}
