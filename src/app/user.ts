export class UserType {
    id: number;
    name: string;
  }
  
  export class User {
    id: number;
    username: string;
    password: string;
    salt: string;
    type: UserType;
  }