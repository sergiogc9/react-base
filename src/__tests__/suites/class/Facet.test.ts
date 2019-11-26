import { FacetItemsGroup, FacetObject, Facet } from "@src/class/Facet";

const facetsGroups: FacetItemsGroup = {
	channel_type_id: [{ key: "24", counter: 22 }],
	country_path: [{ key: "0534", counter: 100 }, { key: "0103", counter: 50 }],
	language_id: [{ key: "127", counter: 250 }]
};

describe('facet class', () => {

	it('should create a new empty facet', () => {
		const f = new Facet();
		expect(f.groups).toBeUndefined();
	});

	it('should create a new Focus with groups', () => {
		const f = new Facet({ groups: facetsGroups });
		expect(f.groups).toEqual(facetsGroups);
	});

});
