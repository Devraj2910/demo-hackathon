export interface DatabaseDto {
  name: string;
  owner: string;
  encoding: string;
  collate: string;
  ctype: string;
}

export interface ListDatabasesResponseDto {
  databases: DatabaseDto[];
} 