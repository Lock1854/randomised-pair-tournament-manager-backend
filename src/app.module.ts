import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TournoiModule } from './tournoi/tournoi.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoueureuseModule } from './joueureuse/joueureuse.module.js';
import { RoundModule } from './round/round.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: '../gestionTournoi.db',
      entities: [import.meta.dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      invalidWhereValuesBehavior: {
        undefined: 'ignore',
      },
    }),
    TournoiModule,
    JoueureuseModule,
    RoundModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
