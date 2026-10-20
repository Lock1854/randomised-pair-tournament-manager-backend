import { Module } from '@nestjs/common';
import { RoundService } from './round.service.js';
import { RoundController } from './round.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaireGeneree } from './entities/paire-generee.entity.js';
import { TournoiModule } from '../tournoi/tournoi.module.js';
import { JoueureuseModule } from '../joueureuse/joueureuse.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([PaireGeneree]), TournoiModule, JoueureuseModule],
  controllers: [RoundController],
  providers: [RoundService],
})
export class RoundModule {}
