import React from 'react';


class DashboardPage extends React.Component {
	constructor(props) {
		super(props);

		this.coloursObject = require('../../public/colours.json');
		this.state = {}
		this.colour = null;
		this.error = false;
	}

	componentDidMount() {
		let input = document.getElementById("colour-input");;

		input.addEventListener("keyup", (e) => {
		  if (e.keyCode === 13) {
			input = document.getElementById("colour-input");
		    e.preventDefault();
		    this.colour = input.value;
		    document.getElementById("submit").click();
		  }
		});
	}

	colourEntered = () => {
		if(this.colour.length != 7)
		{
			console.log("Invalid length of the input hex value!")
			this.error = true;
			return;
		} 
		if (/[0-9a-f]{6}/i.test(this.colour) != true) {
		    console.log("Invalid digits in the input hex value!");
		    this.error = true;
		    return; 
		}
		
		const tempColour = this.colour;
		let closestColours = new Array();
		const rgbTempColour = this.hexToRgb(tempColour);
		let largestDifference = 0;

		let sortedColours = this.coloursObject.colors.sort((a, b) => {

			// calculating a's colour difference for comparison
			const hexA = a.hex;
			const rgbA = this.hexToRgb(hexA);

			const aRDifference = Math.abs(rgbTempColour.r - rgbA.r);
			const aGDifference = Math.abs(rgbTempColour.g - rgbA.g);
			const aBDifference = Math.abs(rgbTempColour.b - rgbA.b);

			const colourDifferenceA = aRDifference + aGDifference + aBDifference;

			// calculating b's colour difference for comparison
			const hexB = b.hex;
			const rgbB = this.hexToRgb(hexB);
			const bRDifference = Math.abs(rgbTempColour.r - rgbB.r);
			const bGDifference = Math.abs(rgbTempColour.g - rgbB.g);
			const bBDifference = Math.abs(rgbTempColour.b - rgbB.b);

			const colourDifferenceB = bRDifference + bGDifference + bBDifference;

			return colourDifferenceA < colourDifferenceB ? -1  : 1;
		})

		const topSortedColours = sortedColours.slice(0, 50);

		this.setState(() => ({
			colours: topSortedColours
		}))
	}

	hexToRgb = (hex) => {
		if (hex == '#000000') {
			return {r: 0, g: 0, b: 0};
		}	

		return {
		    r: parseInt(hex.substring(1,3),16),
		    g: parseInt(hex.substring(3,5),16),
		    b: parseInt(hex.substring(5,7),16)
		};
	}

	hexToCmyk = (hex) => {
		let computedC = 0;
		let computedM = 0;
		let computedY = 0;
		let computedK = 0;

		const r = parseInt(hex.substring(1,3),16); 
		const g = parseInt(hex.substring(3,5),16); 
		const b = parseInt(hex.substring(5,7),16); 

		// BLACK
		if (hex == '#000000') {
			return {c: 0, m: 0,y: 0, k: 100};
		}	

		computedC = 1 - (r/255);
		computedM = 1 - (g/255);
		computedY = 1 - (b/255);

		const minCMY = Math.min(computedC,Math.min(computedM,computedY));

		computedC = Math.round((computedC - minCMY) / (1 - minCMY) * 100);
		computedM = Math.round((computedM - minCMY) / (1 - minCMY) * 100);
		computedY = Math.round((computedY - minCMY) / (1 - minCMY) * 100);
		computedK = Math.round(minCMY * 100);

		return {
		    c: computedC,
		    m: computedM,
		    y: computedY,
		    k: computedK
		};
	}

	render() {
		return (
			<div className="main">
			    <h1>Colors</h1>
			    <input id="colour-input"></input>
			    <button id="submit" onClick={this.colourEntered}>Submit</button>
			    <lo>
			    	<li className="heading-list-item">
			    		<div className="column first-column">
			    			<div className="colour-block"></div>
			    		</div>
			    		<div className="column second-column">
			    			<div className="name-block">
			    				<p>Name</p>
			    			</div>
			    		</div>
			    		<div className="column third-column">
			    			<div className="hex-block">
			    				<p>Hex</p>
			    			</div>
			    		</div>
			    		<div className="column fourth-column">
			    			<div className="rgb-block">
			    				<p>RGB</p>
			    			</div>
			    		</div>
			    		<div className="column fifth-column">
			    			<div className="cmyk-block">
			    				<p>CMYK</p>
			    			</div>
			    		</div>
			    	</li>
			    	{
			    		!!this.state.colours ? 
			    		<div className="table-body">
				    		{				    		
				    			this.state.colours.map((colour) => {
				    				
									const rgb = this.hexToRgb(colour.hex);
									const cmyk = this.hexToCmyk(colour.hex);

					    			return (
					    				<li className="colour-list-item">
								    		<div className="column first-column">
								    			<div className="colour-block" style={{background : `${colour.hex}`}}></div>
								    		</div>
								    		<div className="column second-column">
								    			<div className="name-block">
								    				<p>{colour.color}</p>
								    			</div>
								    		</div>
								    		<div className="column third-column">
								    			<div className="hex-block">
								    				<p>{colour.hex}</p>
								    			</div>
								    		</div>
								    		<div className="column fourth-column">
								    			<div className="rgb-block">
								    				<p>{rgb.r + ", " + rgb.g + ", " + rgb.b}</p>
								    			</div>
								    		</div>
								    		<div className="column fifth-column">
								    			<div className="cmyk-block">
								    				<p>{cmyk.c + ", " + cmyk.m + ", " + cmyk.y + ", " + cmyk.k}</p>
								    			</div>
								    		</div>
								    	</li>
								    )
					    		})
				    		}
			    		</div> : ''
			    	}
			    	
			    </lo>
			</div>
		);
	}
}

export default DashboardPage;
