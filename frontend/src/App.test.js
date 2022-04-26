import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import Site from './site.js';
import SearchArea from './searchArea.js';
import RestroomForm from './restroomForm.js';
import {unmountComponentAtNode} from "react-dom";
import TestRenderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import { act } from "react-dom/test-utils";

Enzyme.configure({ adapter: new Adapter() });

let wrapper;

const values = { values: {
	sijainti: "someLocation",
	kaupunki: "jokuKaupunki",
}
}
describe('Tests for searchForm', () => {
	afterEach(() => {
		wrapper.unmount();
	});
	it("Expect two inputs for searchArea", () => {
		wrapper = shallow(<SearchArea values={values}/>);
		const inputs = wrapper.findWhere((n) => n.name() == 'input');
		expect(inputs).toHaveLength(2);
	});

	it("Changes update input values in searcharea", () => {
		wrapper = mount(<Site />);
		wrapper.find('input').at(0).simulate('change', { target: { value: 'Jyväskylä' , name: 'kaupunki' } });
		wrapper.find('input').at(1).simulate('change', { target: { value: 'VessaSijainti' , name: 'sijainti' } });
		expect(wrapper.find('input').get(0).props.value).toBe('Jyväskylä');
		expect(wrapper.find('input').get(1).props.value).toBe('VessaSijainti');

	});

	it("Clicking buttons should update className in searcharea", () => {
		wrapper = mount(<Site />);
		expect(wrapper.find('button').get(0).props.className).toBe('notClicked');
		wrapper.find('button').at(0).simulate('click');
		expect(wrapper.find('button').get(0).props.className).toBe('clicked');
	});
	
	it("Empty search-submits render error div", () => {
		wrapper = mount(<Site />);
		wrapper.find('form').at(0).simulate('submit');
		expect(wrapper.find('.error')).toHaveLength(1);

	})

});
describe("Tests for restroomform", () => {
	afterEach(() => {
		wrapper.unmount();
	});
	beforeEach(() => {
		wrapper = mount(<Site />);
		wrapper.find('li').at(1).simulate('click');
	});
		
	it("Empty search-submits render error div", () => {
		wrapper = mount(<Site />);
		wrapper.find('form').at(0).simulate('submit');
		expect(wrapper.find('.error')).toHaveLength(1);
	});
	it("Changing input value updates restroomform input values", () => {
		wrapper.find('input').at(0).simulate('change', { target: { value: 'VessaSijainti' , name: 'sijainti' } });
		expect(wrapper.find('input').get(0).props.value).toBe('VessaSijainti');
		expect(wrapper.find('.formArea')).toHaveLength(1);
	});
	it("Expect three inputs, clicking on price adds one input and select", () => {
		expect(wrapper.find('input')).toHaveLength(3);
		wrapper.find('button').at(0).simulate('click');
		expect(wrapper.find('input')).toHaveLength(4);
		expect(wrapper.find('button').get(0).props.className).toBe('clicked')
		wrapper.find('button').at(0).simulate('click');
		expect(wrapper.find('button').get(0).props.className).toBe('notClicked')
	});
	it("Changes update selector value", () => {
		wrapper.find('button').at(0).simulate('click');
		expect(wrapper.find('select').get(0).props.value).toBe('kolikko');
		expect(wrapper.find('option').get(0).props.children).toBe('Maksu kolikolla')

		wrapper.find('select').at(0).simulate('change', {target: {name: 'maksutapa', value: 'kassa'}});
		expect(wrapper.find('select').get(0).props.value).toBe('kassa');

		wrapper.find('select').at(0).simulate('change', {target: {name: 'maksutapa', value: 'liittymä'}});
		expect(wrapper.find('select').get(0).props.value).toBe('liittymä');
	});
});

describe('Tests for navbar', () => {
	afterEach(() => {
		wrapper.unmount()
	});
	it("Clicking elements in navbar changes display element", () => {
		wrapper = mount(<Site />);
		expect(wrapper.find('.searchDiv')).toHaveLength(1);
		wrapper.find('li').at(1).simulate('click');
		expect(wrapper.find('.searchDiv')).toHaveLength(0);
		expect(wrapper.find('.formArea')).toHaveLength(1);

		wrapper.find('li').at(2).simulate('click');
		expect(wrapper.find('.formArea')).toHaveLength(0);
		expect(wrapper.find('.contacts')).toHaveLength(1);
	});
});

describe('Back-end tests for searcharea', () => {
	const restroomObj = {
			city: 'SomeCity',
			location: 'SomeLocation',
			value: 15,
	};
	beforeAll(()=> {
			wrapper = mount(<Site />);
	});
	it("Submiting restroomForm inserts new objects to database", () => {
			wrapper.find('li').at(1).simulate('click');
			wrapper.find('button').at(0).simulate('click');	
			wrapper.find('select').at(0).simulate('change', {target: {name: 'maksutapa', value: 'liittymä'}});
			wrapper.find('input').at(1).simulate('change', {target: {name: 'kaupunki', value: restroomObj.city}});
			wrapper.find('input').at(0).simulate('change', {target: {name: 'sijainti', value: restroomObj.location}});
			wrapper.find('button').at(1).simulate('click');
			wrapper.find('input').at(2).simulate('change', {target: {name: 'hinta', value: restroomObj.value}});


			console.log(Site.prototype.postToDatabase);
			jest.spyOn(Site.prototype, 'postToDatabase');
			wrapper.find('form').at(0).simulate('submit');
			expect(Site.prototype.postToDatabase).toHaveBeenCalled();

	});
});