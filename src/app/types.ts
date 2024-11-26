export interface Memory {
  id: string;
  date: string;
  location: string;
  tags: string;
  image: {
    filePath: string;
    fileLocator: string;
    fileName: string;
    uploadDate: string;
  };
  created_at: string;
  updated_at: string;
}

export interface SearchMemoryResponse {
  "@odata.context": string;
  value: Memory[];
}

export interface MemoryCardProps {
  memory: Memory;
  onDelete: (memoryId: string) => void;
  onView: (memory: Memory) => void;
}

export interface MemoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (location: string, tags: string, image: File | null) => void;
}

export interface MemoryDetailModalProps {
  open: boolean;
  memory: Memory | null;
  onClose: () => void;
  onUpdate: (memoryId: string, memoryData: Partial<Memory>) => Promise<void>;
}
