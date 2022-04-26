import React from 'react';
import NavBar from './navBar.js'
import RestroomForm from './restroomForm.js';
import SearchArea from './searchArea.js';

class Site extends React.Component {
	constructor(props) { 
		super(props);
		this.state = {
			showTab: 0,
			passRequired: false,
			searchForm: {
				sijainti: "",
				kaupunki: "",
				showOnlyFree: false,
				},
			restroomForm: {
				sijainti: "",
				kaupunki: "",
				maksullinen: false,
				hinta: "",
				maksutapa: "kolikko"},
			isSubmited: false,
			prevSearch: [],
			searchResults: [],
			noResults: false,
			errorSearch: false,
			serverError: false,
			submitError: false,
			isLoading: false,
			errorSubmit: false,
		}
		this.handlePageChange = this.handlePageChange.bind(this);
		this.handleButtonClick = this.handleButtonClick.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.postToDatabase = this.postToDatabase.bind(this);
		this.handleAnotherSubmit = this.handleAnotherSubmit.bind(this);
		this.searchSubmit = this.searchSubmit.bind(this);
		this.insertPrice = this.insertPrice.bind(this);
		}
	handleAnotherSubmit () {
		this.setState({restroomForm: {
			sijainti: "",
			kaupunki: "",
			hinta: "",}});
		this.setState({passRequired: false});
		this.setState({isSubmited: false});
	}
	
	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		if (this.state.showTab === 0) {
			const state = Object.assign({}, this.state.searchForm);
			state[name] = value;
			this.setState({
				searchForm: state
			});
		} else if (this.state.showTab === 1) {
			const state = Object.assign({}, this.state.restroomForm);
			state[name] = value;
			this.setState({
				restroomForm: state 
			})
		}
	}
	postToDatabase (event) {
		event.preventDefault();
		const tempForm = this.state.restroomForm;
		if (tempForm.sijainti.length === 0 || tempForm.kaupunki.length === 0) {
			return this.setState({submitError: true});
		}
		let paymentMethod = '';
		let price = '';
		if (tempForm.hinta > 0) {
			paymentMethod = tempForm.maksutapa;
			price = tempForm.hinta;
		}
		this.setState({submitError: false});
		this.setState({serverError: false});
		let form = {
			"sijainti": tempForm.sijainti,
			"kaupunki": tempForm.kaupunki,
			"hinta": price,
			"maksutapa": paymentMethod,
			"passRequired": this.state.passRequired
			}
		let data = JSON.stringify(form);
		let xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://localhost:8000/savetodatabase', true)
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.onreadystatechange = () => {
			if(xhr.readyState===4) {
				if(xhr.status === 400) {
					this.setState({submitError: true});
				}
				if(xhr.status === 500) {
					this.setState({serverError: true});
				}
				if(xhr.status === 202) {
					this.setState({isSubmited: true});
				}
					
			}
		}
		xhr.send(data);
	}
	
	searchSubmit (event) {
		event.preventDefault();	
		if (this.state.searchForm.sijainti.length === 0 && this.state.searchForm.kaupunki.length === 0) {
			return this.setState({errorSearch: true});
		}
		if (JSON.stringify(this.state.prevSearch) !== JSON.stringify(this.state.searchForm)) {
		const prevSearch = Object.assign({}, this.state.searchForm);
		this.setState({prevSearch: prevSearch});
		this.setState({searchResults: null});
		this.setState({noResults: false});
		this.setState({errorSearch: false});
		this.setState({serverError:false});
		const form = this.state.searchForm;
		const params = `?location=${form.sijainti}&city=${form.kaupunki}&showOnlyFree=${this.state.searchForm.showOnlyFree}`;
		let xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://localhost:8000/savetodatabase' + params, true);
		this.setState({isLoading: true});
		xhr.onreadystatechange = ()=> {
			this.setState({isLoading: false});
			if(xhr.readyState===4) {
				const response = xhr.response;				
				if (xhr.status === 400) {
					this.setState({errorSearch: true});
				}
				if (xhr.status === 200) {
					const responseData = {};
					 responseData.data = response.data.map(function(row) {
					 	const resultObject = {};
						resultObject.location = row.location;
						resultObject.city = row.city;
						resultObject.passRequired = row.passRequired;
						resultObject.price = row.price;
						resultObject.paymentMethod = row.paymentMethod;
						return resultObject;
						});
					this.setState({searchResults: responseData.data});	
				} else if (xhr.status === 202) {
					this.setState({noResults: true});
				} else if (xhr.status === 500) {
					this.setState({serverError: true});
				}
			}
		}	
		
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
		xhr.responseType='json';
		xhr.send();
	}
	}
	handlePageChange (tabNum) {	
		this.setState({showTab: tabNum})
	}

	insertPrice () {
		const tempState = Object.assign({}, this.state.restroomForm);
		tempState.maksullinen = !tempState.maksullinen;
		this.setState({restroomForm: tempState});
	}
	handleButtonClick () {
		if (this.state.showTab === 0) {
			const tempSearchForm = Object.assign({}, this.state.searchForm);
			tempSearchForm.showOnlyFree = !tempSearchForm.showOnlyFree;
			this.setState({searchForm: tempSearchForm});
		} else if (this.state.showTab === 1) {
			this.setState(state => ({passRequired: !state.passRequired}));
		}
	}

	render () {
			let pageContent;
			let error = null;
			if (this.state.errorSearch && this.state.showTab === 0) {
				error = (<div className ={"error"}>
					<h2>Täytä ainakin toinen hakukentistä. Hakukenttien täytyy sisältää ainoastaan kirjaimia tai numeroita.</h2>
				</div>)
			} else if (this.state.serverError === true) {
				error = (<div className ={"error"}>
					<h2>Ongelma tietokannassa, yritä myöhemmin uudelleen.</h2>
					<h3>500: Internal server error</h3>
					</div>)
			} else if (this.state.submitError) {
				error = (<div className = {"error"}>
					<h2>Täytä kaikki kentät. Kenttien täytyy sisältää vain kirjaimia tai numeroita.</h2>
					</div>)
			}
			const navBar = <div className={"navBar"} >
								<NavBar onClick={this.handlePageChange}/>
							</div>
				switch(this.state.showTab) {
					case 0:
						pageContent = <SearchArea isLoading={this.state.isLoading} values={this.state.searchForm} noResults={this.state.noResults}results={this.state.searchResults} onClick={this.handleButtonClick} onlyFree={this.state.searchForm.showOnlyFree} onChange={this.handleInputChange} onSubmit={this.searchSubmit}/>
						break;
					case 1:
						pageContent = <RestroomForm isLoading={this.state.isLoading} afterFirstSubmit={this.handleAnotherSubmit} values={this.state.restroomForm} onClick={this.handleButtonClick} passRequired={this.state.passRequired} onChange={this.handleInputChange} onSubmit={this.postToDatabase} isSubmited={this.state.isSubmited} insertPrice={this.state.restroomForm.maksullinen} priceButton={this.insertPrice}/>
						break;
					default:
						break;
				}
		return (
		<div className="page">
			<div className={"pageTop"}>
				<h1 onClick={() => this.handlePageChange(0)}>Suomen julkiset vessat</h1>
				{navBar}
			</div>		
			{error}
			{pageContent}
		</div>
		)
	}			
}
export default Site;
