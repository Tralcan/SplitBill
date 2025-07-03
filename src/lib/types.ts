export interface Item {
  id: string;
  name: string;
  price: number;
  dinerId: string | null;
  isPaid: boolean;
}

export interface Diner {
  id: string;
  name: string;
}
