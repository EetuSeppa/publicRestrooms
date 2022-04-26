import React from 'react';

function NavBarElement (props) {
	return (
		<li onClick={props.onClick}>{props.value}</li>
		)
}
function NavBar (props) {
	return (
		<ul>
			<NavBarElement value={"Haku"} onClick={() => props.onClick(0)}/>
			<NavBarElement value={"Ilmoita vessasta"} onClick={() => props.onClick(1)}/>
		</ul>
		)
}
export default NavBar;
