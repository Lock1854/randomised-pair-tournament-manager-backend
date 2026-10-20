import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaireGeneree } from './entities/paire-generee.entity.js';
import { Repository } from 'typeorm';
import { Joueureuse } from '../joueureuse/entities/joueureuse.entity.js';
import { Tournoi } from '../tournoi/entities/tournoi.entity.js';
import { JoueureuseService } from '../joueureuse/joueureuse.service.js';

type Pair = [Joueureuse, Joueureuse];

const MAX_ROUND_STREAK_ALLOWED = 2;

@Injectable()
export class RoundService {
  constructor(
    @InjectRepository(PaireGeneree)
    private readonly paireGenereeRepository: Repository<PaireGeneree>,
    private readonly joueureuseService: JoueureuseService
  ) {
  }

  async generatePair(tournoi: Tournoi) {
    const nbPlayers = tournoi.nbTerrains * 4;
    const playersToPair: Joueureuse[] = this.selectPlayers(tournoi.joueureuses, nbPlayers, tournoi.prioritiseLessWaiting);
    const createdPairs: Pair[] = [];
    const unpairedPlayers: Joueureuse[] = [];

    let currentPlayer: Joueureuse;
    let partnerIndex: number;
    while (playersToPair.length > 0) {
      currentPlayer = <Joueureuse>playersToPair.pop();

      const pairsWithCurrentPlayer = await this.paireGenereeRepository.find({
        relations: {
          joueureuseA: true,
          joueureuseB: true,
        },
        where: [
          {
            tournoi: { tournoiId: tournoi.tournoiId },
            joueureuseA: { joueureuseId: currentPlayer.joueureuseId },
          },
          {
            tournoi: { tournoiId: tournoi.tournoiId },
            joueureuseB: { joueureuseId: currentPlayer.joueureuseId },
          },
        ],
      });

      const previousPartners = pairsWithCurrentPlayer
        .map((paire) => {
          if (paire.joueureuseA.joueureuseId == currentPlayer.joueureuseId) {
            return paire.joueureuseB;
          } else if (paire.joueureuseB.joueureuseId == currentPlayer.joueureuseId) {
            return paire.joueureuseA;
          }
          throw new Error(`The pair ${JSON.stringify(paire)} does not contain the player ${JSON.stringify(currentPlayer)}`);
        });

      const possiblePartners = playersToPair
        .filter((player) => !previousPartners.includes(player));

      if (possiblePartners.length == 0) {
        unpairedPlayers.push(currentPlayer)
        continue;
      }

      partnerIndex =
        Math.floor(Math.random() * possiblePartners.length);

      createdPairs.push([currentPlayer, playersToPair[partnerIndex]])
      playersToPair.splice(partnerIndex, 1);
    }

    while (unpairedPlayers.length > 0) {
      currentPlayer = <Joueureuse>unpairedPlayers.pop();

      partnerIndex = Math.floor(Math.random() * unpairedPlayers.length);

      createdPairs.push([currentPlayer, unpairedPlayers[partnerIndex]]);
      unpairedPlayers.splice(partnerIndex, 1);
    }

    this.savePairs(createdPairs, tournoi);
    return createdPairs;
  }

  private selectPlayers(players: Joueureuse[], nbPlayers: number, prioritiseLessWaiting: boolean){
    if (players.length < nbPlayers) {
      console.error(`Not enough players : need ${nbPlayers} and only found ${players.length}`);
      return players;
    }

    let minMatchesPlayed = players
      .toSorted((player1, player2) => (player1.nbMatchsJoues ?? 0) - (player2.nbMatchsJoues ?? 0))
      .at(0)?.nbMatchsJoues ?? 0;

    let selectedPlayers = players
      .filter((player) => player.nbMatchsJoues == minMatchesPlayed)
      .filter((player) => (player.roundStreak ?? 0) < MAX_ROUND_STREAK_ALLOWED);

    while (selectedPlayers.length < nbPlayers) {
      minMatchesPlayed++;
      selectedPlayers = selectedPlayers
        .concat(players
          .filter((player) => player.nbMatchsJoues == minMatchesPlayed)
          .filter((player) => (player.roundStreak ?? 0) < MAX_ROUND_STREAK_ALLOWED)
        )
    }

    let randomIndex = 0;
    let maxRoundStreak = MAX_ROUND_STREAK_ALLOWED - 1;

    while (selectedPlayers.length > nbPlayers) {
      if (prioritiseLessWaiting) {
        maxRoundStreak =
          selectedPlayers.toSorted(
            (player1, player2) =>
              (player2.roundStreak ?? 0) - (player1.roundStreak ?? 0),
          )[0].roundStreak ?? 0;
        randomIndex = Math.floor(Math.random() * selectedPlayers.length);
        while (
          (selectedPlayers[randomIndex].roundStreak ?? 0) < maxRoundStreak
        ) {
          if (randomIndex == selectedPlayers.length - 1) randomIndex = 0;
          else randomIndex++;
        }
      } else {
        randomIndex = Math.floor(Math.random() * selectedPlayers.length);
      }
      selectedPlayers.splice(randomIndex, 1);
    }

    for (let player of selectedPlayers) {
      this.joueureuseService.update(player.joueureuseId, {
        roundStreak: (player.roundStreak ?? 0) + 1,
        nbMatchsJoues: (player.nbMatchsJoues ?? 0) + 1,
      });
    }

    const nonSelectedPlayers = players.filter((player) => !selectedPlayers.includes(player));
    for (let player of nonSelectedPlayers) {
      this.joueureuseService.update(player.joueureuseId, {
        roundStreak: 0
      });
    }

    return selectedPlayers;
  }

  private savePairs(pairs: Pair[], tournoi: Tournoi) {
    for (let pair of pairs) {
      this.paireGenereeRepository.save({
        tournoi,
        joueureuseA: pair[0],
        joueureuseB: pair[1],
      });
    }
  }
}
