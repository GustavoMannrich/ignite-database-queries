import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("g")
      .select("g.*")
      .where("LOWER(g.title) LIKE :param", {
        param: `%${param.toLowerCase()}%`,
      })
      .getRawMany();
    // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(*) FROM games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = await this.repository.findOne({ id });

    return this.repository
      .createQueryBuilder()
      .relation(Game, "users")
      .of(game)
      .loadMany();
    // Complete usando query builder
  }
}
