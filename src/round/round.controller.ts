import { Controller, Get, Query } from '@nestjs/common';
import { RoundService } from './round.service.js';
import { TournoiService } from '../tournoi/tournoi.service.js';
import { Tournoi } from '../tournoi/entities/tournoi.entity.js';

@Controller('round')
export class RoundController {
  constructor(
    private readonly roundService: RoundService,
    private readonly tournoiService: TournoiService,
  ) {}

  @Get('paires')
  async generatePair(@Query('tournoiId') tournoiId: string) {
    const tournoi: Tournoi = await this.tournoiService.findOne(tournoiId);
    return this.roundService.generatePair(tournoi);
  }
}
