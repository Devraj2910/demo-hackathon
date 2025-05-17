import { User } from "../../../domain/entities/User";
import { UserDto } from "./SearchUsersResponseDto";

export class SearchUsersResponseMapper {
  static mapToDto(user: User): UserDto {
    return {
      id: user.getId(),
      email: user.getEmail(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      fullName: user.getFullName(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt()
    };
  }
}