import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaireGeneree } from './entities/paire-generee.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class RoundService {
  constructor(
    @InjectRepository(PaireGeneree)
    private readonly paireGenereeRepository: Repository<PaireGeneree>
  ) {
  }
}
