export interface DatabaseProps {
  name: string;
  owner: string;
  encoding: string;
  collate: string;
  ctype: string;
}

export class Database {
  private props: DatabaseProps;

  private constructor(props: DatabaseProps) {
    this.props = props;
  }

  static create(props: DatabaseProps): Database {
    return new Database(props);
  }

  // Getters
  getName(): string {
    return this.props.name;
  }

  getOwner(): string {
    return this.props.owner;
  }

  getEncoding(): string {
    return this.props.encoding;
  }

  getCollate(): string {
    return this.props.collate;
  }

  getCtype(): string {
    return this.props.ctype;
  }

  // For presentation layer to easily access all properties
  toJSON(): DatabaseProps {
    return {
      name: this.getName(),
      owner: this.getOwner(),
      encoding: this.getEncoding(),
      collate: this.getCollate(),
      ctype: this.getCtype()
    };
  }
} 