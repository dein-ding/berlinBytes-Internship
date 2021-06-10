const root = document.querySelector(":root");
const videoContainer = document.querySelector(".videoContainer");

///// nav-bar /////
const toggleColorSlider = document.querySelector("#toggleColorSlider");
const colorSlider = document.querySelectorAll("#colorSlider");

	//settings
	const toggleSettings = document.querySelector("#toggleSettings");
	const keepColorSwitch = document.querySelector("#keepColorSwitch");

	const searchbar = document.querySelector(".search-bar");
	const cancelSearchIcon = document.querySelector(".cancel-icon");
	const googleQuery = document.querySelector("#google-query");

main = () => {
	//set the color theme
	if (eval(window.localStorage.keepColor)) colorTheme.setHue(window.localStorage.defaultHue);
	else colorTheme.setRandomHue();

	//////////////////////////// nav-bar ////////////////////////////

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

		if (event.keyCode == 27) { // ESC
			if (searchbar.value == "") searchbar.blur();
			searchbar.value = "";
		}
	});
	cancelSearchIcon.onclick = () => {
		searchbar.select();
		searchbar.value = "";
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
		colorTheme.hue = hue;
		root.style.setProperty("--primary-clr-hue", hue);
		root.style.setProperty("--dialogBgHue", hue);
		videoContainer.style.filter = `hue-rotate(${hue}deg)`;

		colorSlider[0].value = root.style.getPropertyValue("--primary-clr-hue") || colorTheme.hue;
		colorSlider[1].value = root.style.getPropertyValue("--primary-clr-hue") || colorTheme.hue;

		window.localStorage.defaultHue = hue;

		console.log(`%c colorTheme changed: (${ ("00" + colorTheme.hue).slice(-3) }) 🀫🀫🀫`, `color: hsl(${colorTheme.hue}, 100%, 70%); font-family: menlo;`); //prettier-ignore
	},
	setRandomHue: () => colorTheme.setHue( Math.floor(Math.random() * 360)),
	change: (state) => {
		if (state == "close"){ toggleColorSlider.checked = false; return }

		toggleColorSlider.checked = !toggleColorSlider.checked;

		colorSlider[0].value = root.style.getPropertyValue("--primary-clr-hue") || colorTheme.hue;
		colorSlider[0].oninput = () => colorTheme.setHue(colorSlider[0].value)
	},
};

const settings = {
	toggle: (state) => {
		if (state == "close"){ toggleSettings.checked = false; return }
		
		toggleSettings.checked = !toggleSettings.checked;
		if (toggleSettings.checked) settings.show();
	},
	show: () => {
		settings.init()

		keepColorSwitch.oninput = () => {
			if (keepColorSwitch.checked) {
				settings.storage.defaultHue = colorTheme.hue;
				settings.storage.keepColor = true;
			} else {
				settings.storage.defaultHue = null;
				settings.storage.keepColor = false;
			}
			
			for (const key in settings.storage) {
				if (Object.hasOwnProperty.call(settings.storage, key)) {
					const value = settings.storage[key];
					window.localStorage.setItem(key, value);
				}
			}

			console.log(window.localStorage)
		}

		colorSlider[1].oninput = () => colorTheme.setHue(colorSlider[1].value)
	},
	init: () => {
		keepColorSwitch.checked = eval(window.localStorage.keepColor);
	},
	storage: {
		defaultHue: 120,
		keepColor: false,
	}
};

settings.show()
main();