import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import merge from 'lodash/merge';
import concat from 'lodash/concat';

import { reducers } from '@src/store';
import { INITIAL_STATE } from '@src/store';
import { operators, sagas, FacetItemHash, ShowMoreFacetItem } from '@src/store/search/facets/extended';
import Api from '@src/lib/ajax/Api';

import { State } from '@src/store/types';
import { TreeNode, Tree } from '@src/class/Tree';
import { FacetItem } from '@src/class/Facet';

const nodeAA: TreeNode<ShowMoreFacetItem> = { data: { value: "AA", text: "AA", counter: 70, type: "news" } };
const nodeAB: TreeNode<ShowMoreFacetItem> = { data: { value: "AB", text: "AB", counter: 30, type: "news" } };
const nodeA: TreeNode<ShowMoreFacetItem> = { data: { value: "A", text: "A", counter: 100, type: "news" }, children: [nodeAA, nodeAB] };
nodeAA.parent = nodeA;
nodeAB.parent = nodeA;

const nodeBBA: TreeNode<ShowMoreFacetItem> = { data: { value: "BBA", text: "BBA", counter: 100, type: "news" } };
const nodeBA: TreeNode<ShowMoreFacetItem> = { data: { value: "BA", text: "BA", counter: 100, type: "news" } };
const nodeBB: TreeNode<ShowMoreFacetItem> = { data: { value: "BB", text: "BB", counter: 100, type: "news" }, children: [nodeBBA] };
const nodeB: TreeNode<ShowMoreFacetItem> = { data: { value: "B", text: "B", counter: 100, type: "news" }, children: [nodeBA, nodeBB] };
nodeBBA.parent = nodeBB;
nodeBA.parent = nodeB;
nodeBB.parent = nodeB;

const facetItemsHash: FacetItemHash = {
	A: { collapsed: false, selected: false, node: nodeA },
	AA: { collapsed: false, selected: false, node: nodeAA },
	AB: { collapsed: false, selected: false, node: nodeAB },
	B: { collapsed: false, selected: false, node: nodeA },
	BA: { collapsed: false, selected: false, node: nodeBA },
	BB: { collapsed: false, selected: false, node: nodeBB },
	BBA: { collapsed: false, selected: false, node: nodeBBA }
};

const facetItems: Tree<ShowMoreFacetItem> = { rootNodes: [nodeA, nodeB] };

const APIQueriedMedias = [
	{ id: "media1", name: "Media 1", url: "http://fakeurl1.com" },
	{ id: "media2", name: "Media 2", url: "http://fakeurl2.com" }
];

const onlineMedias: FacetItem[] = [
	{ key: "media1", name: "Media 1", counter: null, detail: "http://fakeurl1.com", type: "news" },
	{ key: "media2", name: "Media 2", counter: null, detail: "http://fakeurl2.com", type: "news" }
];

const printMedias: FacetItem[] = [
	{ key: "media1", name: "Media 1", counter: null, detail: "http://fakeurl1.com", type: "print" },
	{ key: "media2", name: "Media 2", counter: null, detail: "http://fakeurl2.com", type: "print" }
];


const queriedMedias: FacetItem[] = [
	{ key: "media1", name: "Media 1", counter: null, detail: "http://fakeurl1.com", type: "print" },
	{ key: "media2", name: "Media 2", counter: null, detail: "http://fakeurl2.com", type: "news" }
];

function getFullState(stateOverride: object = {}): State {
	return merge({}, INITIAL_STATE, stateOverride);
}

describe('Facets extended reducer', () => {

	it('reducer set facet items hash', () => {
		expect(reducers(
			getFullState(),
			operators.setFacetItemsHash({ facetItemsHash })
		).search.facets.extended)
			.toMatchObject({
				facetItemsHash
			});
	});

	it('reducer set see only filtered', () => {
		expect(reducers(
			getFullState(),
			operators.setSeeOnlySelected({ seeOnlySelected: true })
		).search.facets.extended)
			.toMatchObject({
				seeOnlySelected: true
			});
	});

	it('reducer set all', () => {
		expect(reducers(
			getFullState(),
			operators.setAll({ facetItemsHash, facetItems, seeOnlySelected: true })
		).search.facets.extended)
			.toMatchObject({
				facetItemsHash,
				facetItems,
				seeOnlySelected: true
			});
	});

	it('reducer set filter text', () => {
		expect(reducers(
			getFullState(),
			operators.setFilterText({ filterText: "fake" })
		).search.facets.extended)
			.toMatchObject({
				filterText: "fake"
			});
	});

	it('reducer set queried medias', () => {
		expect(reducers(
			getFullState(),
			operators.setQueriedMedias({ medias: queriedMedias })
		).search.facets.extended)
			.toMatchObject({
				queriedMedias
			});
	});

	it('saga should toggle see only filtered', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.put(operators.setSeeOnlySelected({ seeOnlySelected: true }))
			.dispatch(operators.toggleSeeOnlySelected())
			.hasFinalState(getFullState({
				search: {
					facets: {
						extended: {
							seeOnlySelected: true
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should toggle item collapsed', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ search: { facets: { extended: { facetItemsHash } } } })) // withState always after withReducer
			.put(operators.setFacetItemsHash({ facetItemsHash: { ...facetItemsHash, A: { ...facetItemsHash.A, collapsed: true } } }))
			.dispatch(operators.toggleItemCollapsed({ itemValue: "A" }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						extended: {
							facetItemsHash: { ...facetItemsHash, A: { ...facetItemsHash.A, collapsed: true } }
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should toggle all collapsed', () => {
		const hashAllCollapsed: FacetItemHash = {
			...facetItemsHash,
			A: { ...facetItemsHash.A, collapsed: true },
			B: { ...facetItemsHash.B, collapsed: true }
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ search: { facets: { extended: { facetItemsHash, facetItems } } } })) // withState always after withReducer
			.put(operators.setFacetItemsHash({ facetItemsHash: hashAllCollapsed }))
			.dispatch(operators.toggleCollapseAll({ collapse: true }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						extended: {
							facetItems,
							facetItemsHash: hashAllCollapsed
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should toggle all not collapsed', () => {
		const initialHashCollapsed: FacetItemHash = {
			...facetItemsHash,
			A: { ...facetItemsHash.A, collapsed: true }
		};
		const hashAllNotCollapsed: FacetItemHash = {
			...facetItemsHash,
			A: { ...facetItemsHash.A, collapsed: false },
			B: { ...facetItemsHash.B, collapsed: false }
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ search: { facets: { extended: { facetItemsHash: initialHashCollapsed, facetItems } } } })) // withState always after withReducer
			.put(operators.setFacetItemsHash({ facetItemsHash: hashAllNotCollapsed }))
			.dispatch(operators.toggleCollapseAll({ collapse: false }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						extended: {
							facetItems,
							facetItemsHash: hashAllNotCollapsed
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should enable selected filter', () => {
		const hashFinalSelected: FacetItemHash = {
			...facetItemsHash,
			AB: { ...facetItemsHash.AB, selected: true }
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ search: { facets: { extended: { facetItemsHash, facetItems } } } })) // withState always after withReducer
			.put(operators.setAll({ facetItemsHash: hashFinalSelected, facetItems, seeOnlySelected: false }))
			.dispatch(operators.toggleSelectedFilter({ node: nodeAB, isSelected: false }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						extended: {
							facetItems,
							facetItemsHash: hashFinalSelected
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should enable parent filter', () => {
		const hashInitialSelected: FacetItemHash = {
			...facetItemsHash,
			AA: { ...facetItemsHash.AA, selected: true },
			AB: { ...facetItemsHash.AB, selected: false }
		};
		const hashFinalSelected: FacetItemHash = {
			...facetItemsHash,
			A: { ...facetItemsHash.A, selected: true },
			AA: { ...facetItemsHash.AA, selected: false },
			AB: { ...facetItemsHash.AB, selected: false }
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ search: { facets: { extended: { facetItemsHash: hashInitialSelected, facetItems } } } })) // withState always after withReducer
			.put(operators.setAll({ facetItemsHash: hashFinalSelected, facetItems, seeOnlySelected: false }))
			.dispatch(operators.toggleSelectedFilter({ node: nodeAB, isSelected: false }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						extended: {
							facetItems,
							facetItemsHash: hashFinalSelected
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should disable filter', () => {
		const hashInitialSelected: FacetItemHash = {
			...facetItemsHash,
			AB: { ...facetItemsHash.AB, selected: true }
		};
		const hashFinalSelected: FacetItemHash = {
			...facetItemsHash,
			AB: { ...facetItemsHash.AB, selected: false }
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ search: { facets: { extended: { facetItemsHash: hashInitialSelected, facetItems } } } })) // withState always after withReducer
			.put(operators.setAll({ facetItemsHash: hashFinalSelected, facetItems, seeOnlySelected: false }))
			.dispatch(operators.toggleSelectedFilter({ node: nodeAB, isSelected: true }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						extended: {
							facetItems,
							facetItemsHash: hashFinalSelected
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should disable root node filter', () => {
		const hashInitialSelected: FacetItemHash = {
			...facetItemsHash,
			A: { ...facetItemsHash.A, selected: true }
		};
		const hashFinalSelected: FacetItemHash = {
			...facetItemsHash,
			A: { ...facetItemsHash.A, selected: false }
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ search: { facets: { extended: { facetItemsHash: hashInitialSelected, facetItems } } } })) // withState always after withReducer
			.put(operators.setAll({ facetItemsHash: hashFinalSelected, facetItems, seeOnlySelected: false }))
			.dispatch(operators.toggleSelectedFilter({ node: nodeA, isSelected: true }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						extended: {
							facetItems,
							facetItemsHash: hashFinalSelected
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should disable children filter', () => {
		const hashInitialSelected: FacetItemHash = {
			...facetItemsHash,
			A: { ...facetItemsHash.A, selected: true }
		};
		const hashFinalSelected: FacetItemHash = {
			...facetItemsHash,
			A: { ...facetItemsHash.A, selected: false },
			AA: { ...facetItemsHash.AA, selected: true },
			AB: { ...facetItemsHash.AB, selected: false }
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ search: { facets: { extended: { facetItemsHash: hashInitialSelected, facetItems } } } })) // withState always after withReducer
			.put(operators.setAll({ facetItemsHash: hashFinalSelected, facetItems, seeOnlySelected: false }))
			.dispatch(operators.toggleSelectedFilter({ node: nodeAB, isSelected: true }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						extended: {
							facetItems,
							facetItemsHash: hashFinalSelected
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should disable children while enabling siblings', () => {
		const hashInitialSelected: FacetItemHash = {
			...facetItemsHash,
			B: { ...facetItemsHash.B, selected: true }
		};
		const hashFinalSelected: FacetItemHash = {
			...facetItemsHash,
			B: { ...facetItemsHash.B, selected: false },
			BA: { ...facetItemsHash.BA, selected: true },
			BB: { ...facetItemsHash.BB, selected: false },
			BBA: { ...facetItemsHash.BBA, selected: false }
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ search: { facets: { extended: { facetItemsHash: hashInitialSelected, facetItems } } } })) // withState always after withReducer
			.put(operators.setAll({ facetItemsHash: hashFinalSelected, facetItems, seeOnlySelected: false }))
			.dispatch(operators.toggleSelectedFilter({ node: nodeBBA, isSelected: true }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						extended: {
							facetItems,
							facetItemsHash: hashFinalSelected
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should toggle all selected', () => {
		const hashInitialSelected: FacetItemHash = {
			...facetItemsHash,
			AB: { ...facetItemsHash.AB, selected: true },
			BBA: { ...facetItemsHash.BBA, selected: true }
		};
		const hashFinalSelected: FacetItemHash = {
			...facetItemsHash,
			A: { ...facetItemsHash.A, selected: true },
			AA: { ...facetItemsHash.AA, selected: false },
			AB: { ...facetItemsHash.AB, selected: false },
			B: { ...facetItemsHash.B, selected: true },
			BBA: { ...facetItemsHash.BBA, selected: false }
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ search: { facets: { extended: { facetItemsHash: hashInitialSelected, facetItems } } } })) // withState always after withReducer
			.put(operators.setAll({ facetItemsHash: hashFinalSelected, facetItems, seeOnlySelected: false }))
			.dispatch(operators.toggleSelectedAll({ allSelected: false }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						extended: {
							facetItems,
							facetItemsHash: hashFinalSelected
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should toggle none selected', () => {
		const hashInitialSelected: FacetItemHash = {
			...facetItemsHash,
			A: { ...facetItemsHash.A, selected: true }
		};
		const hashFinalSelected: FacetItemHash = {
			...facetItemsHash,
			A: { ...facetItemsHash.A, selected: false },
			B: { ...facetItemsHash.B, selected: false }
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ search: { facets: { extended: { facetItemsHash: hashInitialSelected, facetItems, seeOnlySelected: true } } } })) // withState always after withReducer
			.put(operators.setAll({ facetItemsHash: hashFinalSelected, facetItems, seeOnlySelected: false }))
			.dispatch(operators.toggleSelectedAll({ allSelected: true }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						extended: {
							facetItems,
							facetItemsHash: hashFinalSelected,
							seeOnlySelected: false
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should fetch queried medias', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), { medias: APIQueriedMedias }]
			])
			.put(operators.setQueriedMedias({ medias: concat(onlineMedias, printMedias) }))
			.dispatch(operators.fetchQueriedMedias({ query: "fake" }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						extended: {
							queriedMedias: concat(onlineMedias, printMedias)
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should fetch queried medias with empty query', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), { medias: APIQueriedMedias }]
			])
			.put(operators.setQueriedMedias({ medias: [] }))
			.dispatch(operators.fetchQueriedMedias({ query: "  " }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						extended: {
							queriedMedias: []
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should fetch queried medias without matched medias', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), {}]
			])
			.put(operators.setQueriedMedias({ medias: [] }))
			.dispatch(operators.fetchQueriedMedias({ query: "fake" }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						extended: {
							queriedMedias: []
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

});
