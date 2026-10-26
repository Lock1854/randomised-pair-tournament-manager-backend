import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJoueureuseDto } from './dto/create-joueureuse.dto.js';
import { UpdateJoueureuseDto } from './dto/update-joueureuse.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Joueureuse } from './entities/joueureuse.entity.js';
import { TournoiService } from '../tournoi/tournoi.service.js';

@Injectable()
  export class JoueureuseService {
  constructor(
    @InjectRepository(Joueureuse)
    private readonly joueureuseRepository: Repository<Joueureuse>,
    private readonly tournoiService: TournoiService,
  ) {}

  async create(dto: CreateJoueureuseDto): Promise<Joueureuse> {
    const retard = await this.computeLateness(dto, dto.tournoiId);

    const { tournoiId, ...restDto } = dto;
    const joueureuse = this.joueureuseRepository.create({
      ...restDto,
      retard,
      tournoi: { tournoiId },
    });
    return this.joueureuseRepository.save(joueureuse);
  }

  private async computeLateness(
    dto: CreateJoueureuseDto | UpdateJoueureuseDto,
    tournoiId: string,
  ) {
    const playersInTournament = await this.tournoiService.findPlayers(
      tournoiId,
    );
    const playerWhoPlayedLess = playersInTournament
      .filter((player) => player.actif)
      .toSorted(
        (player1, player2) =>
          player1.nbMatchsJoues +
          player1.retard -
          (player2.nbMatchsJoues + player2.retard),
      )[0];
    return (
      playerWhoPlayedLess.nbMatchsJoues +
      playerWhoPlayedLess.retard -
      (dto.nbMatchsJoues ?? 0)
    );
  }

  async findOne(id: string): Promise<Joueureuse> {
    const joueureuse = await this.joueureuseRepository.findOne({
      where: { joueureuseId: id },
      relations: { tournoi: true },
    });
    if (!joueureuse) {
      throw new NotFoundException(`Joueureuse ${id} introuvable`);
    }
    return joueureuse;
  }

  async update(id: string, dto: UpdateJoueureuseDto): Promise<Joueureuse> {
    const joueureuse = await this.findOne(id);
    this.joueureuseRepository.merge(joueureuse, dto);

    if (!joueureuse) {
      throw new NotFoundException(`Joueureuse ${id} introuvable`);
    }
    if (dto.actif) {
      joueureuse.retard = await this.computeLateness(dto, joueureuse.tournoi.tournoiId);
    }
    return this.joueureuseRepository.save(joueureuse);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.joueureuseRepository.delete({ joueureuseId: id });
  }
}
