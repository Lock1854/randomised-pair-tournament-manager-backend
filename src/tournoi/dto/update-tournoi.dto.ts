import { PartialType } from '@nestjs/mapped-types';
import { CreateTournoiDto } from './create-tournoi.dto.js';

export class UpdateTournoiDto extends PartialType(CreateTournoiDto) {}
