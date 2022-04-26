import React from 'react';
class RestroomForm extends React.Component {
	render() {
		let isClicked;
		if(this.props.passRequired) {
			isClicked = "clicked";	 
		} else if (!this.props.passRequired) {
			isClicked = "notClicked";
		}
		let priceLabel;
		if (this.props.insertPrice) {
			priceLabel = (
			<label className={"priceLabel"}>
				<p>Hinta/€:</p>
				<input name="hinta" type="number" max="20" value={this.props.values.hinta}  onChange={this.props.onChange}/>
				<select name="maksutapa" value={this.props.values.maksutapa} onChange={this.props.onChange}>
					<option value="kolikko">Maksu kolikolla</option>
					<option value="liittymä">Maksu puhelinliittymällä</option>
					<option value="kassa">Maksu kassalle</option>
				</select>
			</label>)
		} else {
			priceLabel = null;
		}
				
		if(this.props.isSubmited) {
			return (
				<div className={"thanksDiv"}>
					<h2>Kiitos ajastasi!</h2>
					<h3>Ilmoita toisesta vessasta</h3>
					<button onClick={this.props.afterFirstSubmit}></button>
				</div>
			)
		}
		return (
		<div className = {"formArea"}>
			<div className={"formInfo"}>
				<h2>Ilmoita vessasta tietokantaan</h2>
			</div>
			<form className={"restRoomForm"} onSubmit={this.props.onSubmit}>
				<label>
					<p>Sijainti:</p>
					<input name="sijainti" value={this.props.values.sijainti} type="text" onChange={this.props.onChange}/>
				</label>
				<label>
					<p>Kaupunki:</p>
					<input name="kaupunki" value={this.props.values.kaupunki} type="text" onChange={this.props.onChange}/>
				</label>
				<label>
					Maksullinen:
					<button className={this.props.insertPrice? "clicked": "notClicked"} onClick={this.props.priceButton} type="button"></button>
				</label>
				{priceLabel}
				<label>
					Vessapassi vaaditaan: 
					<button onClick={this.props.onClick} className={isClicked} type="button">{null}</button>
				</label>
				<input type="submit" value="Submit" />	
			</form>
		</div>
			)
	}
}

export default RestroomForm;
