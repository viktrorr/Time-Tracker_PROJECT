export type Project = {
  id: string;
  name: string;
  client: string | null;
  colorHex: string;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
};
