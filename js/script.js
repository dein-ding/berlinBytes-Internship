const root = document.querySelector(":root");
const hueSlider = document.querySelector("#hue-slider");
const videoContainer = document.querySelector(".videoContainer");
const searchbar = document.querySelector(".search-bar");
const cancelSearchIcon = document.querySelector(".cancel-icon");
const googleQuery = document.querySelector("#google-query");

main = () => {
	//set theme to a random color
	colorTheme.setHue( Math.floor(Math.random() * 360) ); //prettier-ignore

	//////////////////////////// nav-bar ////////////////////////////

	/////////// change color theme  ///////////
	action = () =>
		custom.slider( "", "Change the Color-Theme of the Website.", root.style.getPropertyValue("--primary-clr-hue") || colorTheme.hue, val => colorTheme.setHue(val) ); //prettier-ignore

	/////////////// search-bar ///////////////
	searchbar.addEventListener("keydown", event => {
		if (event.keyCode == 13) {// ENTER
			searchbar.blur();
			if (searchbar.value)
				custom.confirm( "search for this on google?", searchbar.value, "Yes", "No" ) //prettier-ignore
					.then( () => {
						let query = searchbar.value.toString().replace(" ", "+");
						googleQuery.href = `https://www.google.com/search?q=${query}`;
						googleQuery.click();
					})
					.catch( () => {})
		}

		if (event.keyCode == 27) {// ESC
			if (searchbar.value == "") searchbar.blur();
			searchbar.value = "";
		}
	});
	cancelSearchIcon.onclick = () => {
		searchbar.value = "";
		searchbar.select();
	};

	///////////////// links /////////////////
	document
		.querySelectorAll(".dummy")
		.forEach( item => item.onclick = () => custom.confirm("this is just a dummy link", "", "OK") ); //prettier-ignore
};

const colorTheme = {
	hue: 120,
	/**
	 * **sets the color-theme for the whole website**
	 * @param {number} hue the hue-value the color-theme is gonna be set to
	 */
	setHue: hue => {
		this.hue = hue;
		root.style.setProperty("--primary-clr-hue", hue);
		root.style.setProperty("--dialogBgHue", hue);
		videoContainer.style.filter = `hue-rotate(${hue}deg)`;
	},
};

main();




"https://www.google.com/search?q=test+1231"