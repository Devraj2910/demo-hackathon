export interface HealthProps {
  status: string;
  timestamp: Date;
  version?: string;
  uptime?: number;
}

export class Health {
  private props: HealthProps;

  private constructor(props: HealthProps) {
    this.props = props;
  }

  static create(props: HealthProps): Health {
    return new Health(props);
  }

  // Getters
  getStatus(): string {
    return this.props.status;
  }

  getTimestamp(): Date {
    return this.props.timestamp;
  }

  getVersion(): string | undefined {
    return this.props.version;
  }

  getUptime(): number | undefined {
    return this.props.uptime;
  }
} 