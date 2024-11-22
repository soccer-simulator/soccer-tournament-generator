import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';

import { AppStoreContext } from './AppStore.ts';
import { Button } from './components/bulma/Button/Button.tsx';
import { Field } from './components/bulma/Field/Field.tsx';
import { Select } from './components/bulma/Select/Select.tsx';
import { SelectOption } from './components/bulma/Select/types.ts';
import { tournamentTypes } from './constants/soccer.ts';
import { TournamentType } from './types/soccer.ts';
import { useContext } from './utils/context.ts';
import { getTournamentTypeAvailableTeamsCount, getTournamentTypeLabel } from './utils/soccer.ts';
import { defined } from './utils/type-guard.ts';

const tournamentTypeOptions: ReadonlyArray<SelectOption<TournamentType>> = tournamentTypes.map(
  (tournamentType): SelectOption<TournamentType> => {
    return { value: tournamentType, label: getTournamentTypeLabel(tournamentType) };
  }
);

export const Options = observer(() => {
  const appStore = useContext(AppStoreContext);

  const { tournamentType, teamsCount } = appStore;

  const availableTeamsCount = useMemo(() => getTournamentTypeAvailableTeamsCount(tournamentType), [tournamentType]);
  const teamsCountOptions = availableTeamsCount.map(
    (teamsCount): SelectOption => {
      return { value: teamsCount, label: teamsCount };
    },
    [availableTeamsCount]
  );

  return (
    <>
      <Field label="Тип турнира">
        <Select
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
          options={teamsCountOptions}
          value={teamsCount}
          onChange={(teamsCount) => {
            if (defined(teamsCount)) {
              appStore.setTeamsCount(teamsCount);
            }
          }}
        />
      </Field>
      <Button type="primary">Сгенерировать</Button>
    </>
  );
});
