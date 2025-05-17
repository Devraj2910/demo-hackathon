import { UserRepository } from '../../../repositories/UserRepository';
import { SearchUsersRequestDto } from './SearchUsersRequestDto';
import { SearchUsersResponseDto, UserDto } from './SearchUsersResponseDto';
import { User } from '../../../domain/entities/User';
import { SearchUsersResponseMapper } from './SearchUsersResponseMapper';

export class SearchUsers {
  constructor(private userRepository: UserRepository) {}

  /**
   * Executes the search users use case
   * @param dto The search request data
   * @returns Promise containing the search results
   */
  async execute(dto: SearchUsersRequestDto): Promise<SearchUsersResponseDto> {
    const users = await this.userRepository.searchUsers(dto.searchText);
    
    return {
      users: users.map(SearchUsersResponseMapper.mapToDto)
    };
  }
  
} 