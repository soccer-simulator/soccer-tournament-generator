import { createMapFn } from 'map-fn';

import { Competition, CountryRegion, CountryTeam, Team } from '../../../types/soccer.ts';

let teamId = 0;

function createTeam(team: Omit<Team, 'id'>): Team {
  return { id: ++teamId, ...team };
}

function createCountryTeam(team: Omit<Team, 'id'> & { region: CountryRegion }): CountryTeam {
  const { region, ...restTeam } = team;
  return { ...createTeam(restTeam), region };
}

const countries: Array<CountryTeam> = [
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

export const getCompetitionTeams = createMapFn<Competition, Array<Team>>({
  worldCup: countries,
  euroCup: countries.filter((country) => country.region === 'europe')
});
