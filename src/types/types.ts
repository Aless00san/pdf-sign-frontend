export default interface User {
  id: string;
  email: string;
  password: string;
}

export interface Document {
  id: string;
  name: string;
  userId: string;
  status: string;
}
