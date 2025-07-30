export interface Team {
  id?: number;
  name: string;
  description: string;
  code: string;
  isActive: boolean;
}

export interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Team) => void;
  team?: Team | null;
  loading: boolean;
}
