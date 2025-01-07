export interface Objective {
    id: string;
    title: string;
    description: string,
  }
export interface Task{
    id:string,
    title: string,
    description: string,
    date: Date,
    items: Item[],
    objectiveId?: string;
}

export interface Item{
    name: string,
    completed: boolean
}