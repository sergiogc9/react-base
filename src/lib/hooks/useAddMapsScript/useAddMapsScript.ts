import { useAddScript } from '@sergiogc9/react-hooks';

const API_KEY = 'EDIT';

const useAddMapsScript = () => {
	useAddScript('google-maps-api', `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`);
};

export default useAddMapsScript;
