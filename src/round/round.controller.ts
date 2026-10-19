import { Controller } from '@nestjs/common';
import { RoundService } from './round.service.js';

@Controller('round')
export class RoundController {
  constructor(private readonly roundService: RoundService) {}
}
