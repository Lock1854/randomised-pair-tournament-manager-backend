import { PartialType } from '@nestjs/mapped-types';
import { CreateJoueureuseDto } from './create-joueureuse.dto.js';

export class UpdateJoueureuseDto extends PartialType(CreateJoueureuseDto) {}
