import { Module } from '@nestjs/common';
import { TournoiService } from './tournoi.service.js';
import { TournoiController } from './tournoi.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournoi } from './entities/tournoi.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Tournoi])],
  controllers: [TournoiController],
  providers: [TournoiService],
})
export class TournoiModule {}
