export interface Item {
  id: string;
  name: string;
  price: number;
  calories: number;
  description: string;
  dinerId: string | null;
}

export interface Diner {
  id: string;
  name: string;
}
