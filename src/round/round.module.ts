import { Module } from '@nestjs/common';
import { RoundService } from './round.service.js';
import { RoundController } from './round.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaireGeneree } from './entities/paire-generee.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([PaireGeneree])],
  controllers: [RoundController],
  providers: [RoundService],
})
export class RoundModule {}
