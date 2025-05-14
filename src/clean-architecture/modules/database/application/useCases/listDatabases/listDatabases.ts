import { DatabaseRepository } from '../../../repositories/databaseRepository';
import { ListDatabasesResponseDto } from './listDatabasesResponseDto';

export class ListDatabases {
  constructor(private databaseRepository: DatabaseRepository) {}

  async execute(): Promise<ListDatabasesResponseDto> {
    const databases = await this.databaseRepository.listDatabases();
    
    return {
      databases: databases.map(db => ({
        name: db.getName(),
        owner: db.getOwner(),
        encoding: db.getEncoding(),
        collate: db.getCollate(),
        ctype: db.getCtype()
      }))
    };
  }
} 