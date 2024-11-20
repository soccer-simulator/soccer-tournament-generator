import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import { AppStore } from './AppStore.ts';

import './App.css';

export const App = observer(() => {
  const [appStore] = useState(() => new AppStore());

  const { initialized } = appStore;

  console.log(initialized);

  useEffect(() => {
    (async () => {
      await appStore.init();
    })();
  }, []);

  if (!initialized) {
    return null;
  }

  return <h1>Soccer Tournament Generator</h1>;
});
