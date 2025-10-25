export interface Developer {
  id: number;
  name: string;
  age: number;
  fullStack: boolean;
  endDate: string;
}

export interface DeveloperPaginated {
  data:Developer[];
  total:number;
}

export interface DeveloperFormData{
  name: string;
  age: number;
  fullStack: boolean;
  endDate: string;
}