// fetch("http://floyd-api.herokuapp.com/webuntis")
// .then(console.log)
// .catch(() => { console.warn("something went wrong"); });

const root = document.querySelector(":root");
const hueSlider = document.querySelector("#hue-slider");

// hueSlider.oninput = () => {
//     root.style.setProperty("--primary-clr-hue", hueSlider.value);
//     console.log("input");
// };

const searchbar = document.querySelector(".search-bar");
searchbar.addEventListener("keydown", () => {
    console.log(searchbar.value)
})

action = () => {
    custom.slider("", "Change the Color Value of the Website.", (val) => {
        root.style.setProperty("--primary-clr-hue", val);
        root.style.setProperty("--dialogBgHue", val);
    })
};