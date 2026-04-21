export type TaskName = {
  id: string;
  name: string;
  normalized: string;
  usageCount: number;
  lastUsedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
