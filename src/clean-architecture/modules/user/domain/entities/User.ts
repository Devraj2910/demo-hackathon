export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private props: UserProps;

  private constructor(props: UserProps) {
    this.props = props;
  }

  public static create(props: UserProps): User {
    return new User(props);
  }

  // Getters
  public getId(): string {
    return this.props.id;
  }

  public getEmail(): string {
    return this.props.email;
  }

  public getPasswordHash(): string {
    return this.props.passwordHash;
  }

  public getFirstName(): string | null {
    return this.props.firstName;
  }

  public getLastName(): string | null {
    return this.props.lastName;
  }

  public getCreatedAt(): Date {
    return this.props.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.props.updatedAt;
  }

  public getFullName(): string {
    if (this.props.firstName && this.props.lastName) {
      return `${this.props.firstName} ${this.props.lastName}`;
    } else if (this.props.firstName) {
      return this.props.firstName;
    } else if (this.props.lastName) {
      return this.props.lastName;
    }
    return '';
  }
} 