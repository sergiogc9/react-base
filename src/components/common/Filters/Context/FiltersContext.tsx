import React from 'react';

import { FiltersContextData } from './types';

const FiltersContext = React.createContext<FiltersContextData>({} as any);

export default FiltersContext;
