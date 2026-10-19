import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Joueureuse } from '../../joueureuse/entities/joueureuse.entity.js';

@Entity()
export class Tournoi {
  @PrimaryGeneratedColumn("uuid")
  tournoiId: string;

  @Column()
  date: Date;

  @Column()
  nbTerrains: number;

  @Column()
  dureeMatch: number;

  @Column()
  prioritiseLessWaiting: boolean;

  @OneToMany(type => Joueureuse, (joueureuse) => joueureuse.tournoi)
  joueureuses: Joueureuse[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
