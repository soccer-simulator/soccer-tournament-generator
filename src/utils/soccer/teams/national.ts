import { createMapFn } from 'map-fn';

import { NationalCompetition, Region, NationalTeam, Team } from '../../../types/soccer.ts';

let teamId = 0;

function createTeam(team: Omit<Team, 'id'>): Team {
  return { id: ++teamId, ...team };
}

function createCountryTeam(team: Omit<Team, 'id'> & { region: Region }): NationalTeam {
  const { region, ...restTeam } = team;
  return { ...createTeam(restTeam), region };
}

const nationalTeams: Array<NationalTeam> = [
  createCountryTeam({ name: 'Аргентина', shortName: 'АРГ', region: 'southAmerica' }),
  createCountryTeam({ name: 'Франция', shortName: 'ФРА', region: 'europe' }),
  createCountryTeam({ name: 'Испания', shortName: 'ИСП', region: 'europe' }),
  createCountryTeam({ name: 'Англия', shortName: 'АНГ', region: 'europe' }),
  createCountryTeam({ name: 'Бразилия', shortName: 'БРА', region: 'southAmerica' }),
  createCountryTeam({ name: 'Португалия', shortName: 'ПОР', region: 'europe' }),
  createCountryTeam({ name: 'Нидерланды', shortName: 'НИД', region: 'europe' }),
  createCountryTeam({ name: 'Бельгия', shortName: 'БЕЛ', region: 'europe' }),
  createCountryTeam({ name: 'Италия', shortName: 'ИТА', region: 'europe' }),
  createCountryTeam({ name: 'Германия', shortName: 'ГЕР', region: 'europe' }),
  createCountryTeam({ name: 'Уругвай', shortName: 'УРУ', region: 'southAmerica' }),
  createCountryTeam({ name: 'Колумбия', shortName: 'КОЛ', region: 'southAmerica' }),
  createCountryTeam({ name: 'Хорватия', shortName: 'ХОР', region: 'europe' }),
  createCountryTeam({ name: 'Марокко', shortName: 'МАР', region: 'africa' }),
  createCountryTeam({ name: 'Япония', shortName: 'ЯПО', region: 'asia' }),
  createCountryTeam({ name: 'С.Ш.А.', shortName: 'США', region: 'northAmerica' }),
  createCountryTeam({ name: 'Сенегал', shortName: 'СЕН', region: 'africa' }),
  createCountryTeam({ name: 'Иран', shortName: 'ИРН', region: 'asia' }),
  createCountryTeam({ name: 'Мексика', shortName: 'МЕК', region: 'northAmerica' }),
  createCountryTeam({ name: 'Швейцария', shortName: 'ШВР', region: 'europe' }),
  createCountryTeam({ name: 'Дания', shortName: 'ДАН', region: 'europe' }),
  createCountryTeam({ name: 'Австрия', shortName: 'АВС', region: 'europe' }),
  createCountryTeam({ name: 'Южная Корея', shortName: 'КОР', region: 'asia' }),
  createCountryTeam({ name: 'Эквадор', shortName: 'ЭКВ', region: 'southAmerica' }),
  createCountryTeam({ name: 'Украина', shortName: 'УКР', region: 'europe' }),
  createCountryTeam({ name: 'Австралия', shortName: 'АВЛ', region: 'oceania' }),
  createCountryTeam({ name: 'Швеция', shortName: 'ШВЕ', region: 'europe' }),
  createCountryTeam({ name: 'Турция', shortName: 'ТУР', region: 'europe' }),
  createCountryTeam({ name: 'Уэльс', shortName: 'УЭЛ', region: 'europe' }),
  createCountryTeam({ name: 'Венгрия', shortName: 'ВЕН', region: 'europe' }),
  createCountryTeam({ name: 'Канада', shortName: 'КАН', region: 'northAmerica' }),
  createCountryTeam({ name: 'Сербия', shortName: 'СЕР', region: 'europe' })
];

export const getNationalCompetitionTeams = createMapFn<NationalCompetition, Array<Team>>({
  worldCup: nationalTeams,
  euroCup: nationalTeams.filter((country) => country.region === 'europe'),
  copaAmerica: nationalTeams.filter((country) => country.region === 'southAmerica'),
  concacafCup: nationalTeams.filter((country) => country.region === 'northAmerica'),
  africaNationsCup: nationalTeams.filter((country) => country.region === 'africa'),
  asianCup: nationalTeams.filter((country) => country.region === 'asia'),
  ofkNationsCup: nationalTeams.filter((country) => country.region === 'oceania')
});
