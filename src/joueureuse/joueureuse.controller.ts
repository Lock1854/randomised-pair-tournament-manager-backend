import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { JoueureuseService } from './joueureuse.service.js';
import { CreateJoueureuseDto } from './dto/create-joueureuse.dto.js';
import { Joueureuse } from './entities/joueureuse.entity.js';
import { DeleteResult } from 'typeorm';
import { UpdateJoueureuseDto } from './dto/update-joueureuse.dto.js';

enum ResultatMatch {
  GAGNE = "gagne",
  PERDU = "perdu",
}

@Controller('joueureuse')
export class JoueureuseController {
  constructor(private readonly joueureuseService: JoueureuseService) {}

  @Post()
  async create(@Body() createJoueureuseDto: CreateJoueureuseDto) {
    return await this.joueureuseService.create(createJoueureuseDto);
  }

  @Get()
  async findOne(@Query('id') id: string) {
    return this.joueureuseService.findOne(id);
  }

  @Patch('nom')
  async updateNom(@Query('id') id: string, @Query('nom') nom: string) {
    console.debug(`id: ${id}, nom: ${nom}`);
    return this.joueureuseService.update(id, { nom });
  }

  @Patch('resultats-match')
  async updateResultatMatch(
    @Query('id') id: string,
    @Query('resultatMatch') resultatMatch: ResultatMatch,
  ) {
    console.debug(`id: ${id}, resultatMatch: ${resultatMatch}`);
    let { nbMatchsJoues, nbVictoires } = (await this.joueureuseService.findOne(
      id,
    )) as Joueureuse;
    if (nbMatchsJoues === undefined) nbMatchsJoues = 0;
    if (nbVictoires === undefined) nbVictoires = 0;

    if (resultatMatch === ResultatMatch.GAGNE) {
      return await this.joueureuseService.update(id, {
        nbMatchsJoues: nbMatchsJoues + 1,
        nbVictoires: nbVictoires + 1,
      });
    } else if (resultatMatch === ResultatMatch.PERDU) {
      return await this.joueureuseService.update(id, {
        nbMatchsJoues: nbMatchsJoues + 1,
      });
    }
  }

  @Put()
  async update(@Query('id') id: string, @Body() dto: UpdateJoueureuseDto) {
    return this.joueureuseService.update(id, dto);
  }

  @Delete()
  async delete(@Query('id') id: string): Promise<DeleteResult> {
    return this.joueureuseService.delete(id);
  }

  @Delete('reset')
  async remove() {}
}
