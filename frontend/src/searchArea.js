import React from 'react';
function SearchResultRow (props) {
	const row = props.row;
	const passRequired = row.passRequired === true? 'Kyllä': 'Ei';
	let paymentMethod;
	switch (row.paymentMethod) {
		case "kolikko":
			paymentMethod = "Maksu kolikolla";
			break;
		case "kassa":
			paymentMethod = "Maksu kassalle";
			break;
		case "liittymä":
			paymentMethod = "Maksu puhelinliittymällä";
			break;
		default:
			paymentMethod = '-';
			break;
	}
	const hinta = row.price === 0 || row.price === '' ? '-' : row.price;
	return (
		<div>
			<ul>
				<li className={"firstElement"}>{row.location}</li>
				<li className={"secondElement"}>{row.city} </li>
				<li className={"thirdElement"}>{hinta}</li>
				<li className={"fourthElement"}>{paymentMethod}</li>
				<li className={"fourthElement"}>{passRequired}</li>
			</ul>
		</div>
		)
}

class SearchArea extends React.Component {
	render () {
		let results = null;
		let isClicked;
		if(this.props.onlyFree) {
			isClicked = "clicked"
		} else if(!this.props.onlyFree) {
			isClicked = "notClicked"
		}
		if(this.props.results) {
			results = this.props.results.map((row,index) => <SearchResultRow key={index} row={row}/>)
		} else if(this.props.noResults) {
			results = <h2>Ei tuloksia</h2>;
		}
		let submitButton;
		if (!this.props.isLoading) {
			submitButton = <button type="submit" >{null}</button>
		} else if (this.props.isLoading) {
			submitButton = null;
		}
		return (
		<div className={"searchDiv"}>
		<div className={"searchBar"}>
			<h2>Hae tietokannasta</h2>
			<form className={"searchForm"} onSubmit={this.props.onSubmit}>
				<label>
					Kaupunki
					<input className = "kaupunki" name="kaupunki" type="text" onChange={this.props.onChange} value={this.props.values.kaupunki} />
				</label>
				<label>
					Sijainti
					<input name="sijainti" type="text" onChange={this.props.onChange} value={this.props.values.sijainti}/>
				</label>
				<label>
					Näytä ainoastaan ilmaiset 
					<button className={isClicked} onClick={this.props.onClick} type="button">{null}</button>
				</label>
				<label>
					Hae
			{submitButton}	
				</label>
			</form>
		</div>
		<div className = {"searchArea"}>
		<div className={"searchResults"}>
			<div className={"topRow"}>
				<ul>
					<li className={"firstElement"}>Sijainti</li>
					<li className={"secondElement"}>Kaupunki</li>
					<li className={"thirdElement"}>Hinta/€</li>
					<li className={"fourthElement"}>Maksutapa</li>
					<li className={"fifthElement"}>Vessapassi vaaditaan</li>
				</ul>
			</div>
				{results}
		</div>
		</div>
	</div>
		)
	}
}
export default SearchArea;
