export interface SearchUsersRequestDto {
  /**
   * The text to search for in user records
   * Searches will match against email, firstName, and lastName fields
   */
  searchText: string;
} 