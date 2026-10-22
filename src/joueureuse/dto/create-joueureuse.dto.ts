import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateJoueureuseDto {
  @IsString()
  nom: string;

  @IsUUID()
  tournoiId: string;

  @IsOptional()
  @IsInt()
  nbMatchsJoues?: number;

  @IsOptional()
  @IsInt()
  nbVictoires?: number;

  @IsOptional()
  @IsBoolean()
  aGagne?: boolean;

  @IsOptional()
  @IsInt()
  roundStreak?: number;

  @IsOptional()
  @IsInt()
  retard?: number;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
