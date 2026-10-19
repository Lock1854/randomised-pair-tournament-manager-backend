import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { TournoiService } from './tournoi.service.js';
import { CreateTournoiDto } from './dto/create-tournoi.dto.js';
import { Joueureuse } from '../joueureuse/entities/joueureuse.entity.js';

@Controller('tournoi')
export class TournoiController {
  constructor(private readonly tournoiService: TournoiService) {}

  @Post()
  async create(@Body() createTournoiDto: CreateTournoiDto) {
    return this.tournoiService.create(createTournoiDto);
  }

  @Get()
  async findOne(@Query('id') id: string) {
    return this.tournoiService.findOne(id);
  }

  @Get('all')
  async findAll() {
    return this.tournoiService.findAll();
  }


  @Get("joueureuses")
  async findPlayers(tournoiId: string): Promise<Joueureuse[]> {
    return (await this.tournoiService.findOne(tournoiId)).joueureuses;
  }

  @Patch('nb-terrains')
  async updateNbTerrains(
    @Query('id') id: string,
    @Query('nbTerrains') nbTerrains: number,
  ) {
    console.debug(`[controller] id: ${id}, nbTerrains: ${nbTerrains}`)
    return this.tournoiService.update(id, { nbTerrains });
  }

  @Patch('duree-match')
  async updateDureeMatch(
    @Query('id') id: string,
    @Query('dureeMatch') dureeMatch: number,
  ) {
    return this.tournoiService.update(id, { dureeMatch });
  }

  @Patch('attente')
  async updateAttente(@Query('id') id: string, @Query('attente') attente: string) {
    return this.tournoiService.update(id, { prioritiseLessWaiting: attente == "true" });
  }

  @Delete()
  async delete(@Query("id") id: string) {
    return this.tournoiService.remove(id);
  }

  @Delete('terminer')
  async terminer() {
  }
}
