import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import css from './App.module.css';
import { AppStore, AppStoreContext } from './AppStore.ts';
import { Container } from './components/bulma/Container/Container.tsx';
import { Header } from './components/Header.tsx';
import { Options } from './Options.tsx';

export const App = observer(() => {
  const [appStore] = useState(() => new AppStore());

  const { initialized } = appStore;

  useEffect(() => {
    (async () => {
      await appStore.init();
    })();
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    <AppStoreContext.Provider value={appStore}>
      <Header />
      <Container className={css.container}>
        <Options />
      </Container>
    </AppStoreContext.Provider>
  );
});
