fetch("http://localhost:3000/webuntis")
.then(console.log)
.catch((err) => { console.error("something went wrong: " + err); });

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