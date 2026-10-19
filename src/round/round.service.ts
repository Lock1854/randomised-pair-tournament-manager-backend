import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaireGeneree } from './entities/paire-generee.entity.js';
import { Repository } from 'typeorm';
import { Joueureuse } from '../joueureuse/entities/joueureuse.entity.js';

@Injectable()
export class RoundService {
  constructor(
    @InjectRepository(PaireGeneree)
    private readonly paireGenereeRepository: Repository<PaireGeneree>
  ) {
  }

  async selectPlayers(players: Joueureuse[], nbPlayers: number){
    if (players.length < nbPlayers) {
      console.error(`Not enough players : need ${nbPlayers} and only found ${players.length}`);
      return players;
    }

    let minMatchesPlayed = players
      .toSorted((player1, player2) => (player1.nbMatchsJoues || 0) - (player2.nbMatchsJoues || 0))
      .at(0)?.nbMatchsJoues || 0;

    let playersWhoPlayedLess = players.filter((player) => player.nbMatchsJoues == minMatchesPlayed);

    while (playersWhoPlayedLess.length < nbPlayers) {
      minMatchesPlayed++;
      playersWhoPlayedLess = playersWhoPlayedLess
        .concat(players.filter((player) => player.nbMatchsJoues == minMatchesPlayed))
    }

    let randomIndex = 0;
    while (playersWhoPlayedLess.length > nbPlayers) {
      randomIndex = Math.floor(Math.random() * playersWhoPlayedLess.length);
      playersWhoPlayedLess.splice(randomIndex, 1);
    }

    return playersWhoPlayedLess;
  }
}
