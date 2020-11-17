import { IPlayerType, ITeam } from '../index.d';

export function createTeamStub(name: string): ITeam {
  return {
    name: name
  }
}

export function createPlayerTypeStub(pluralName: string): IPlayerType {
  return {
    plural_name: pluralName
  }
}
