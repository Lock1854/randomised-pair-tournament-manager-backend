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
  @PrimaryColumn("text")
  @ManyToOne((type) => Joueureuse)
  @JoinColumn({ name: 'joueureuseIdA' })
  joueureuseA: Joueureuse;

  @PrimaryColumn("text")
  @ManyToOne((type) => Joueureuse)
  @JoinColumn({ name: 'joueureuseIdB' })
  joueureuseB: Joueureuse;

  @PrimaryColumn("text")
  @ManyToOne((type) => Tournoi)
  @JoinColumn({ name: 'tournoiId' })
  tournoi: Tournoi;
}