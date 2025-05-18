export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  role: string;
  position?: string;
  createdAt: Date;
  updatedAt: Date;
  permission?: string;
}

export class User {
  private props: UserProps;

  private constructor(props: UserProps) {
    this.props = props;
  }

  static create(props: UserProps): User {
    return new User(props);
  }

  // Getters
  get id(): string { return this.props.id; }
  get email(): string { return this.props.email; }
  get passwordHash(): string { return this.props.passwordHash; }
  get firstName(): string | undefined { return this.props.firstName; }
  get lastName(): string | undefined { return this.props.lastName; }
  get role(): string { return this.props.role; }
  get position(): string | undefined { return this.props.position; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }
  get permission(): string | undefined { return this.props.permission; }

  // Business logic methods
  updateProfile(firstName?: string, lastName?: string, position?: string): void {
    if (firstName !== undefined) {
      this.props.firstName = firstName;
    }
    
    if (lastName !== undefined) {
      this.props.lastName = lastName;
    }
    
    if (position !== undefined) {
      this.props.position = position;
    }
    
    this.props.updatedAt = new Date();
  }

  updateRole(role: string): void {
    this.props.role = role;
    this.props.updatedAt = new Date();
  }

  updatePasswordHash(passwordHash: string): void {
    this.props.passwordHash = passwordHash;
    this.props.updatedAt = new Date();
  }
} 