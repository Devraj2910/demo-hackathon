import { v4 as uuidv4 } from 'uuid';

export interface WeeklyReportProps {
  id?: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  reportData: any; // This will store the analytics dashboard data
  sentTo: string;
  status: 'pending' | 'sent' | 'failed';
  errorMessage?: string;
}

export class WeeklyReport {
  private props: WeeklyReportProps;

  private constructor(props: WeeklyReportProps) {
    this.props = {
      ...props,
      id: props.id || uuidv4()
    };
  }

  static create(props: WeeklyReportProps): WeeklyReport {
    return new WeeklyReport(props);
  }

  // Getters
  getId(): string {
    return this.props.id!;
  }

  getStartDate(): Date {
    return this.props.startDate;
  }

  getEndDate(): Date {
    return this.props.endDate;
  }

  getCreatedAt(): Date {
    return this.props.createdAt;
  }

  getReportData(): any {
    return this.props.reportData;
  }

  getSentTo(): string {
    return this.props.sentTo;
  }

  getStatus(): 'pending' | 'sent' | 'failed' {
    return this.props.status;
  }

  getErrorMessage(): string | undefined {
    return this.props.errorMessage;
  }

  // Business methods
  markAsSent(): void {
    this.props.status = 'sent';
  }

  markAsFailed(errorMessage: string): void {
    this.props.status = 'failed';
    this.props.errorMessage = errorMessage;
  }
} 