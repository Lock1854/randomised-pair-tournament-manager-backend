import { Module } from '@nestjs/common';
import { JoueureuseService } from './joueureuse.service.js';
import { JoueureuseController } from './joueureuse.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Joueureuse } from './entities/joueureuse.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Joueureuse])],
  controllers: [JoueureuseController],
  providers: [JoueureuseService],
})
export class JoueureuseModule {}
