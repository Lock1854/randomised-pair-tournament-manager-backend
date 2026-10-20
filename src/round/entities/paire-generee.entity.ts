import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Joueureuse } from '../../joueureuse/entities/joueureuse.entity.js';
import { Tournoi } from '../../tournoi/entities/tournoi.entity.js';

@Entity()
export class PaireGeneree {
  @PrimaryColumn('text')
  tournoiId: string;

  @PrimaryColumn('text')
  joueureuseIdA: string;

  @PrimaryColumn('text')
  joueureuseIdB: string;

  @ManyToOne(() => Joueureuse, { nullable: false })
  @JoinColumn({ name: 'joueureuseIdA' })
  joueureuseA: Joueureuse;

  @ManyToOne(() => Joueureuse, { nullable: false })
  @JoinColumn({ name: 'joueureuseIdB' })
  joueureuseB: Joueureuse;

  @ManyToOne(() => Tournoi, { nullable: false })
  @JoinColumn({ name: 'tournoiId' })
  tournoi: Tournoi;
}