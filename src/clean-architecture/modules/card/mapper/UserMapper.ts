import { UserDetailsDto } from "../application/useCases/getCards/getCardsResponseDto";
import { User } from "../../user/domain/entities/User";

export class UserMapper {
  static toDetailsDto(user: User | null): UserDetailsDto | null {
    if (!user) return null;
    
    return {
      id: user.getId(),
      email: user.getEmail(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      fullName: user.getFullName()
    };
  }
} 