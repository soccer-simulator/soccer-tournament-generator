import { observer } from 'mobx-react-lite';

import { AppStoreContext } from './AppStore.ts';
import { Button } from './components/bulma/Button/Button.tsx';
import { Field } from './components/bulma/Field/Field.tsx';
import { Label } from './components/bulma/Label/Label.tsx';
import { Select } from './components/bulma/Select/Select.tsx';
import { SelectOption } from './components/bulma/Select/types.ts';
import { competitions, tournamentTypes } from './constants/soccer.ts';
import { Competition, TournamentType } from './types/soccer.ts';
import { useContext } from './utils/context.ts';
import { getCompetitionLabel, getTournamentTypeLabel } from './utils/soccer';
import { generateTournamentPdf } from './utils/soccer/tournament';
import { defined } from './utils/type-guard.ts';

const tournamentTypeOptions: ReadonlyArray<SelectOption<TournamentType>> = tournamentTypes.map(
  (tournamentType): SelectOption<TournamentType> => {
    return { value: tournamentType, label: getTournamentTypeLabel(tournamentType) };
  }
);

const competitionOptions: ReadonlyArray<SelectOption<Competition | 'none'>> = [
  { value: 'none', label: 'Любое' },
  ...competitions.map((competition): SelectOption<Competition | 'none'> => {
    return { value: competition, label: getCompetitionLabel(competition) };
  })
];

export const GeneratorControls = observer(() => {
  const appStore = useContext(AppStoreContext);

  const { competition, tournamentType, availableTeamsCount, teamsCount, selectedTeams } = appStore;

  const teamsCountOptions = availableTeamsCount.map(
    (teamsCount): SelectOption => {
      return { value: teamsCount, label: teamsCount };
    },
    [availableTeamsCount]
  );

  const onGenerateButtonClick = async () => {
    await generateTournamentPdf(tournamentType, teamsCount, selectedTeams);
  };

  return (
    <div className="fixed-grid has-4-cols">
      <div className="grid">
        <div className="cell">
          <Field label="Соревнование">
            <Select
              fullWidth
              options={competitionOptions}
              value={competition}
              onChange={(competition) => {
                if (defined(competition)) {
                  appStore.setCompetition(competition === 'none' ? undefined : competition);
                }
              }}
            ></Select>
          </Field>
          <Field label="Тип турнира">
            <Select
              fullWidth
              options={tournamentTypeOptions}
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
          <Button type="primary" onClick={onGenerateButtonClick}>
            Сгенерировать
          </Button>
        </div>
        {competition && (
          <div className="cell is-col-start-3">
            <Label>Команды</Label>
            <ul>
              {selectedTeams.map((team) => {
                return <li key={team.id}>{team.name}</li>;
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
});
