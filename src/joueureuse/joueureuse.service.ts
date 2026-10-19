import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJoueureuseDto } from './dto/create-joueureuse.dto.js';
import { UpdateJoueureuseDto } from './dto/update-joueureuse.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Joueureuse } from './entities/joueureuse.entity.js';

@Injectable()
export class JoueureuseService {
  constructor(
    @InjectRepository(Joueureuse)
    private readonly joueureuseRepository: Repository<Joueureuse>
  ) {
  }

  async create(dto: CreateJoueureuseDto): Promise<Joueureuse> {
    console.debug(`dto: ${JSON.stringify(dto)}`);
    const { tournoiId, ...restDto } = dto;
    const joueureuse = this.joueureuseRepository.create({
      ...restDto,
      tournoi: {tournoiId}
    });
    console.debug(`created joueureuse: ${JSON.stringify(joueureuse)}`);
    return this.joueureuseRepository.save(joueureuse);
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
    const joueureuse = await this.joueureuseRepository.preload({
      joueureuseId: id,
      ...dto,
    });
    if (!joueureuse) {
      throw new NotFoundException(`Joueureuse ${id} introuvable`);
    }
    return this.joueureuseRepository.save(joueureuse);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.joueureuseRepository.delete({ joueureuseId: id });
  }
}
