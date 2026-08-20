import { observer } from 'mobx-react-lite';

import { AppStoreContext } from './AppStore.ts';
import { Button } from './components/bulma/Button/Button.tsx';
import { Checkbox } from './components/bulma/Checkbox/Checkbox.tsx';
import { Field } from './components/bulma/Field/Field.tsx';
import { Label } from './components/bulma/Label/Label.tsx';
import { Select } from './components/bulma/Select/Select.tsx';
import { SelectOption } from './components/bulma/Select/types.ts';
import { CLUB_COMPETITIONS, NATIONAL_COMPETITIONS, TEAM_ORDERS, TOURNAMENT_TYPES } from './constants/soccer.ts';
import { ClubCompetition, Competition, NationalCompetition, TeamOrder, TournamentType } from './types/soccer.ts';
import { useContext } from './utils/context.ts';
import {
  getClubCompetitionLabel,
  getNationalCompetitionLabel,
  getTeamOrderLabel,
  getTournamentTypeLabel
} from './utils/soccer';
import { generateTournamentPdf } from './utils/soccer/tournament';
import { defined } from './utils/type-guard.ts';

const TOURNAMENT_TYPE_OPTIONS: ReadonlyArray<SelectOption<TournamentType>> = TOURNAMENT_TYPES.map(
  (tournamentType): SelectOption<TournamentType> => {
    return { value: tournamentType, label: getTournamentTypeLabel(tournamentType) };
  }
);

const COMPETITION_OPTIONS: ReadonlyArray<SelectOption<Competition | 'none'>> = [
  { value: 'none', label: 'Любое' },
  ...NATIONAL_COMPETITIONS.map((competition): SelectOption<NationalCompetition> => {
    return { value: competition, label: getNationalCompetitionLabel(competition) };
  }),
  ...CLUB_COMPETITIONS.map((competition): SelectOption<ClubCompetition> => {
    return { value: competition, label: getClubCompetitionLabel(competition) };
  })
];

const TEAM_ORDER_OPTIONS: ReadonlyArray<SelectOption<TeamOrder>> = TEAM_ORDERS.map((teamOrder) => {
  return { value: teamOrder, label: getTeamOrderLabel(teamOrder) };
});

export const GeneratorControls = observer(() => {
  const appStore = useContext(AppStoreContext);

  const {
    competition,
    tournamentType,
    leagueMatchDays,
    availableTeamsCount,
    teamsCount,
    teamOrder,
    evaluatedTeams,
    selectedTeams,
    teamSelectionValid
  } = appStore;

  const teamsCountOptions = availableTeamsCount.map(
    (teamsCount): SelectOption => {
      return { value: teamsCount, label: teamsCount };
    },
    [availableTeamsCount]
  );

  const onGenerateButtonClick = async () => {
    await generateTournamentPdf(tournamentType, { teamsCount, teams: selectedTeams, teamOrder, leagueMatchDays });
  };

  return (
    <div className="fixed-grid has-4-cols">
      <div className="grid">
        <div className="cell">
          <Field label="Соревнование">
            <Select
              fullWidth
              options={COMPETITION_OPTIONS}
              value={competition}
              onChange={(competition) => {
                appStore.setCompetition(competition === 'none' ? undefined : competition);
              }}
            ></Select>
          </Field>
          <Field label="Тип турнира">
            <Select
              fullWidth
              options={TOURNAMENT_TYPE_OPTIONS}
              value={tournamentType}
              onChange={(tournamentType) => {
                if (defined(tournamentType)) {
                  appStore.setTournamentType(tournamentType);
                }
              }}
            />
          </Field>
          <Field label="Количество команд">
            <Select
              fullWidth
              options={teamsCountOptions}
              value={teamsCount}
              onChange={(teamsCount) => {
                if (defined(teamsCount)) {
                  appStore.setTeamsCount(teamsCount);
                }
              }}
            />
          </Field>
          <Field>
            <Select
              fullWidth
              options={TEAM_ORDER_OPTIONS}
              value={teamOrder}
              onChange={(teamOrder) => {
                if (defined(teamOrder)) {
                  appStore.setTeamOrder(teamOrder);
                }
              }}
            />
          </Field>
          {tournamentType === 'league' && (
            <Field>
              <Checkbox
                value={leagueMatchDays}
                onChange={(renderLeaguesMatches) => {
                  appStore.setLeagueMatchDays(renderLeaguesMatches);
                }}
              >
                Отрисовать матчи по турам
              </Checkbox>
            </Field>
          )}
          <Button type="primary" disabled={!teamSelectionValid} onClick={onGenerateButtonClick}>
            Сгенерировать
          </Button>
        </div>
        {competition && (
          <div className="cell is-col-start-3">
            <Label>
              Команды ({selectedTeams.length} / {teamsCount})
            </Label>
            <ul>
              {evaluatedTeams.map((team) => {
                const selected = appStore.teamSelected(team);
                return (
                  <li key={team.id}>
                    <Checkbox
                      value={selected}
                      onChange={(selected) => {
                        appStore.setTeamSelected(team.id, selected);
                      }}
                    >
                      {team.name}
                    </Checkbox>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
});
