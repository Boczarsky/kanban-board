export interface BoardColumn {
  id: string;
  color: string;
  title: string;
  tasks: ColumnTask[];
  addTaskEnabled?: boolean;
}

export interface ColumnTask {
  id: string;
  title: string;
  description: string;
}