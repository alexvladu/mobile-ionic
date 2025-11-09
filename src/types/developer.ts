export interface Developer {
  id: number;
  name: string;
  age: number;
  fullStack: boolean;
  endDate: string;
  lat: number;
  lng: number;
  photoURL?: string;
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