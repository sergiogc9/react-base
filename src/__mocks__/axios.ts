import mockAxios from 'jest-mock-axios';
mockAxios.create = (() => ({ request: (config: any) => mockAxios.request(config) })) as any; // Needed after CRA v4 and jest v26
export default mockAxios;
