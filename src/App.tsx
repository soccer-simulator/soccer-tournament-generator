import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import { AppStore } from './AppStore.ts';

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
    <section className="hero is-link">
      <div className="hero-body">
        <p className="title">Soccer Tournament Generator</p>
        <p className="subtitle">generate your own tournament tables</p>
      </div>
    </section>
  );
});
