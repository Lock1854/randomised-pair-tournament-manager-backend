import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Tournoi } from './entities/tournoi.entity.js';
import { CreateTournoiDto } from './dto/create-tournoi.dto.js';
import { UpdateTournoiDto } from './dto/update-tournoi.dto.js';
import { Joueureuse } from '../joueureuse/entities/joueureuse.entity.js';

@Injectable()
export class TournoiService {
  constructor(
    @InjectRepository(Tournoi)
    private readonly tournoiRepository: Repository<Tournoi>,
  ) {}

  async create(dto: CreateTournoiDto): Promise<Tournoi> {
    const tournoi = this.tournoiRepository.create(dto);
    return this.tournoiRepository.save(tournoi);
  }

  async findOne(id: string): Promise<Tournoi> {
    const tournoi = await this.tournoiRepository.findOne({
      where: { tournoiId: id },
      relations: { joueureuses: true },
    });
    if (!tournoi) {
      throw new NotFoundException(`Tournoi ${id} introuvable`);
    }
    return tournoi;
  }

  async findPlayers(tournoiId: string): Promise<Joueureuse[]> {
    return (await this.findOne(tournoiId)).joueureuses;
  }

  async findAll(): Promise<Tournoi[]> {
    return this.tournoiRepository.find({
      order: { date: 'ASC' },
    });
  }

  async update(id: string, dto: UpdateTournoiDto): Promise<Tournoi> {
    const tournoi = await this.tournoiRepository.preload({
      tournoiId: id,
      ...dto,
    });
    if (!tournoi) {
      throw new NotFoundException(`Tournoi ${id} introuvable`);
    }
    console.debug(
      tournoi.prioritiseLessWaiting,
      typeof tournoi.prioritiseLessWaiting,
    );
    return this.tournoiRepository.save(tournoi);
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.tournoiRepository.delete({ tournoiId: id });
  }
}
