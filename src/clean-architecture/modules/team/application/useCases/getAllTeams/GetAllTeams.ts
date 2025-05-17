import { TeamRepository } from '../../../repositories/TeamRepository';
import { GetAllTeamsResponseDto } from './GetAllTeamsResponseDto';
import { TeamMapper } from '../../../mapper/TeamMapper';

export class GetAllTeams {
  constructor(private teamRepository: TeamRepository) {}

  async execute(): Promise<GetAllTeamsResponseDto[]> {
    const teams = await this.teamRepository.findAll();
    return TeamMapper.toDTOList(teams);
  }
} 