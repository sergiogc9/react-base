import React from 'react';

import { HoverContextData } from './types';

const HoverContext = React.createContext<HoverContextData>({} as any);

export default HoverContext;
