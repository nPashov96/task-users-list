export interface Address {
  street: string;
  suite: string;
  city: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}
