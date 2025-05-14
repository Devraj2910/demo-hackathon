import { PostgresDatabaseRepository } from '../../../infrastructure/repositories/postgresDatabaseRepository';
import { ListDatabases } from './listDatabases';

export class ListDatabasesFactory {
  static create() {
    const databaseRepository = new PostgresDatabaseRepository();
    const useCase = new ListDatabases(databaseRepository);
    
    return { useCase };
  }
} 