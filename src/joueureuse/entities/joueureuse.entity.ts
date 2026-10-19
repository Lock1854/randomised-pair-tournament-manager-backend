import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as typeorm from 'typeorm';
import { Tournoi } from '../../tournoi/entities/tournoi.entity.js';

@Entity()
export class Joueureuse {
  @PrimaryGeneratedColumn('uuid')
  joueureuseId: string;

  @Column()
  nom: string;

  @ManyToOne((type) => Tournoi, (tournoi) => tournoi.joueureuses, {nullable: false})
  @JoinColumn({ name: 'tournoiId' })
  tournoi: typeorm.Relation<Tournoi>;

  @Column({ default: 0 })
  nbMatchsJoues?: number;

  @Column({ default: 0 })
  nbVictoires?: number;

  @Column({ default: false })
  aGagne?: boolean;

  @Column({ default: 0 })
  roundStreak?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
