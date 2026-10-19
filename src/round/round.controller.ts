import { Controller, Get, Post, Query } from '@nestjs/common';
import { RoundService } from './round.service.js';
import { TournoiService } from '../tournoi/tournoi.service.js';
import { Tournoi } from '../tournoi/entities/tournoi.entity.js';

@Controller('round')
export class RoundController {
  constructor(private readonly roundService: RoundService, private readonly tournoiService: TournoiService) {}

  @Post("generer-paire")
  async generatePair(){}

  @Get("selectionner-joueureuses")
  async selectPlayers(@Query('tournoiId') tournoiId: string) {
    const tournoi: Tournoi = await this.tournoiService.findOne(tournoiId);
    const nbPlayers = tournoi.nbTerrains * 4;
    return this.roundService.selectPlayers(tournoi.joueureuses, nbPlayers);
  }
}
