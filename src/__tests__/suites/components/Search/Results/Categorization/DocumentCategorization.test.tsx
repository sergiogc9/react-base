import { mount, ReactWrapper } from "enzyme";
import React from "react";
import { PrintDocument, OnlineDocument } from "@src/class/Document";
import DocumentCategorization from "@src/components/Search/Results/Categorization/DocumentCategorization";
import { UserObject } from "@src/class/User";
import GA from '@src/lib/googleAnalytics';

// TODO: Use user from test helper
const user: UserObject = ({
	id: "123456",
	name: "user",
	email: "user@user.com",
	role: "admin",
	permissions: ["document.categorize", "document.tag"]
});

const printDocument = new PrintDocument({
	id: "document-id-1",
	title: "Document title",
	provider: "Print",
	content: "Document content",
	category: "120509",
	tags: ["test", "test2"],
	company: "Company",
	brand_associated: "Brand",
	line: "Line"
});

const onlineDocument = new OnlineDocument({
	...printDocument,
	provider: "News",
	company: "",
	brand_associated: "",
	line: ""
});

describe("Document Categorization", () => {

	let wrapper: ReactWrapper;
	const onRemoveDocumentCategory = jest.fn();
	const onRemoveDocumentTag = jest.fn();

	beforeEach(() => {
		wrapper = mount(
			<DocumentCategorization user={user} document={printDocument} onRemoveDocumentCategory={onRemoveDocumentCategory} onRemoveDocumentTag={onRemoveDocumentTag}></DocumentCategorization>
		);
	});

	it("Test pop up visibility", () => {
		expect(wrapper.state("showPopup")).toBe(false);
		wrapper.find(".icon-tag").at(0).simulate("mouseEnter");
		expect(wrapper.state("showPopup")).toBe(true);
		wrapper.find(".icon-tag").at(0).simulate("mouseLeave");
		expect(wrapper.state("showPopup")).toBe(false);
	});

	it("State popup should not change", () => {
		expect(wrapper.state("showPopup")).toBe(false);
		wrapper.find(".icon-tag").at(0).simulate("click");
		wrapper.find(".icon-tag").at(0).simulate("mouseEnter");
		expect(wrapper.state("showPopup")).toBe(true);
		wrapper.find(".icon-tag").at(0).simulate("mouseLeave");
		expect(wrapper.state("showPopup")).toBe(true);
	});

	it("Test company visibility", () => {
		wrapper.setState({ showPopup: true });
		expect(wrapper.find(".company-container")).toHaveLength(1);
		wrapper.setProps({ document: onlineDocument });
		expect(wrapper.find(".company-container")).toHaveLength(0);
	});

	it("Test category visibility", () => {
		wrapper.setState({ showPopup: true });
		expect(wrapper.find(".category-container")).toHaveLength(1);
		wrapper.setProps({ document: { ...printDocument, category: "" } });
		expect(wrapper.find(".category-container")).toHaveLength(0);
	});

	it("Test tags visibility", () => {
		wrapper.setState({ showPopup: true });
		expect(wrapper.find(".tags-container")).toHaveLength(1);
		wrapper.setProps({ document: { ...printDocument, tags: [] } });
		expect(wrapper.find(".tags-container")).toHaveLength(0);
	});

	it("Test popup without tags", () => {
		wrapper.setState({ showPopup: true });
		wrapper.setProps({ document: { ...OnlineDocument, tags: null } });
		expect(wrapper.find(".tags-container")).toHaveLength(0);
	});

	it("Test edit mode", () => {
		expect(wrapper.state("showPopup")).toBe(false);
		wrapper.find(".icon-tag").at(0).simulate("click");
		expect(wrapper.state("showPopup")).toBe(true);
	});

	it("Test edit categories permissions", () => {
		wrapper.setState({ showPopup: true, editMode: true });
		expect(wrapper.find(".category-container .can-remove-categorization")).toHaveLength(0);
		wrapper.setProps({ document: onlineDocument });
		expect(wrapper.find(".category-container .can-remove-categorization")).toHaveLength(1);
		wrapper.setProps({ user: { ...user, permissions: [] } });
		expect(wrapper.find(".category-container .can-remove-categorization")).toHaveLength(0);
	});

	it("Test edit tags permissions", () => {
		wrapper.setState({ showPopup: true, editMode: true });
		expect(wrapper.find(".tags-container .can-remove-categorization")).toHaveLength(2);
		wrapper.setProps({ user: { ...user, permissions: [] } });
		expect(wrapper.find(".tags-container .can-remove-categorization")).toHaveLength(0);
	});

	it("Test remove category execution", () => {
		GA.trackEvent = jest.fn();
		wrapper.setState({ showPopup: true, editMode: true });
		wrapper.setProps({ document: onlineDocument });
		wrapper.find(".category-container .delete-categorization-btn").at(0).simulate('click');
		expect(onRemoveDocumentCategory).toHaveBeenCalledTimes(1);
		expect(GA.trackEvent).toHaveBeenCalledTimes(1);
	});

	it("Test remove tag execution", () => {
		GA.trackEvent = jest.fn();
		wrapper.setState({ showPopup: true, editMode: true });
		wrapper.setProps({ document: onlineDocument });
		wrapper.find(".tags-container .delete-categorization-btn").at(0).simulate('click');
		expect(onRemoveDocumentTag).toHaveBeenCalledTimes(1);
		expect(GA.trackEvent).toHaveBeenCalledTimes(1);
	});
});
