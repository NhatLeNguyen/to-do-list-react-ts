export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  list: string;
  completed: boolean;
};

export type Category = {
  id: string;
  name: string;
  taskCount: number;
};
