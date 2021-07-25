import mockAxios from 'jest-mock-axios';
// Needed after CRA v4 and jest v26
mockAxios.create = (() => ({ request: (config: any) => mockAxios.request(config) })) as any;
export default mockAxios;
