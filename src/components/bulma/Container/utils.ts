import { createMapFnUndefined } from 'map-fn';

import { ContainerType } from './types.ts';

export const getContainerTypeClassName = createMapFnUndefined<ContainerType, string>({
  widescreen: 'is-widescreen',
  fullhd: 'is-fullhd',
  'max-desktop': 'is-max-desktop',
  'max-widescreen': 'is-max-widescreen',
  fluid: 'is-fluid'
});
