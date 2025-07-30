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
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  team: { id: string; name: string; description: string; code: string; isActive: boolean };
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
