//////// DevMode ///////
//prettier-ignore
var DevMode = {
    status: location.hostname == "127.0.0.1" ? true : sessionStorage.devModeStatus ? true : false,
    keepAcrossPages: false,
    callback: null,
    set(status) {
        this.status = status;
        this.execute();
    },
    toggle() {
        this.status = !this.status;
        this.execute();
    },
    execute() {
        console.group("%c DevMode ", this.consoleStyle)
        this.log();

        if (this.keepAcrossPages) sessionStorage.devModeStatus = this.status;
        else sessionStorage.removeItem("devModeStatus");

        if (this.callback) {
            let res = this.callback(this.status);
            if (res) text = res;
            else text = `settings ${this.status ? "applied" : "cleared"}`;
            
            console.log(`%c ${text} `, this.consoleStyle);
        }

        this.toggleItems(this.status);

        console.groupEnd();
    },
    log() {
        console.log(`%c ${this.status ? "enabled" : "disabled"} on: ${location.hostname} `, this.consoleStyle);
        if (!this.callback)
            console.warn("no DevMode callback available");
    },
    items: [],
    toggleItems(status) {
        const projectsDropdown = document.querySelector(".projects-dropdown");
        const devModeItem = document.querySelectorAll(".devModeItem")
        // console.log(this.items)
        
        switch (status) {
            case true:
                if (DevMode.items.length == 0) {
                    
                    //adds the devMode GUI elements
                    let devModeContainer = document.createElement("div")
                    devModeContainer.classList.add("devModeItem", "devModeContainer")
                    devModeContainer.innerHTML = `
                    <div class="toolbox">
                        <button class="quit" title="quit DevMode" onclick="DevMode.set(false)">
                            <i class="fas fa-power-off"></i>
                        </button>
                        <button class="log" title="log DevMode settings" onclick="DevMode.log()">
                            <i class="fas fa-info-circle"></i>
                        </button>
                        <button class="reExecute" title="reexecute DevMode settings" onclick="DevMode.execute()">
                            <i class="fas fa-redo-alt"></i>
                        </button>

                        <button onclick="location.href = 'webuntis.html'">
                            <i class="fad fa-calendar-alt"></i>
                        </button>

                        <button class="evalJS" onclick="test('eval')">
                            <i class="fab fa-js-square"></i>
                        </button>

                        <button title="show a prompt dialog" onclick="test('prompt')">
                            <i class="fas fa-keyboard"></i>
                        </button>
                        <button title="show a confirmation dialog" onclick="test('confirm')">
                            <i class="fad fa-window"></i>
                        </button>
                    </div>
                    <div class="userCountDisplay" style="display:none;"></div>
                    `
                    document.body.append(devModeContainer);
                    DevMode.items.push(devModeContainer);

                    let userCountDisplay = document.querySelector(".userCountDisplay")
                    getUserCountAsync().then((res) => {
                        userCountDisplay.innerHTML = `
                        <h3>UserCount</h3>
                        <p>on host: ${
                            res.onDomain.toString().length > 18
                                ? res.onDomain.toString().slice(0, 16) + "..."
                                : res.onDomain
                        }</P>
                        <p>Today: <b>${res.today}</b></P>
                        <p>Yesterday: ${res.yesterday}</P>
                        <p>Ever: ${res.ever}</P>
                        `;
                        userCountDisplay.style.display = "block";
                    });
                }
                break;
            case false:
                if (this.items) this.items.forEach((x) => x.remove())
                this.items = [];
                break;
        }
        // console.log(this.items)
        console.log(`%c items ${status ? "added" : "removed"} `, this.consoleStyle);
    },
    consoleStyle: 'color: rgb(3, 238, 31); background-color: black;',
};

$(document).ready(async () => {
    //elements
    const head = document.getElementsByTagName("HEAD")[0];
    const titleTag = document.querySelector("title");
    var navBarHeader = document.querySelector("#navBarHeader");
    var footer = document.querySelector("#footer");
    const body = document.body;

    //variables
    var locationURL = {
        prev: sessionStorage.currURL ? sessionStorage.currURL : undefined, //prettier-ignore
        curr: location.pathname,
    };
    sessionStorage.currURL = location.pathname;
    sessionStorage.prevURL = locationURL.prev;

    //create link for favicon
    const linkFavicon = document.createElement("LINK");
    linkFavicon.rel = "shortcut icon";
    linkFavicon.type = "image/png";
    linkFavicon.href = "favicon.png";
    head.prepend(linkFavicon);

    // adds a prefix before the title
    titleTag.innerText = "website - " + titleTag.innerText;

    //execute DevMode preferences
    // if (DevMode.status) DevMode.execute();
});

test = async (type) => {
    switch (type) {
        case "confirm":
            custom
                .confirm(
                    "Attention",
                    "this is a confirmation dialog",
                    "Ok",
                    "leave me alone"
                )
                .then(console.info)
                .catch(console.info);
            break;
        case "prompt":
            console.info(
                "input recieved: " +
                    (await custom.prompt(
                        "Wait a sec,",
                        "this is a prompt for user input"
                    ))
            );
            break;
        case "eval":
            eval(
                await custom.prompt(
                    "evaluate JS",
                    "type in valid JavaScript for evaluation."
                )
            );
    }
};

getFile = (URL) => {
    var XHR = new XMLHttpRequest();
    XHR.open("GET", URL, false);
    XHR.send();

    //console.log("injected:" + XHR.responseText);
    return XHR.responseText;
};

const custom = {
    /**
     * **presents a custom alert dialog**
     * @param {string} title leave empty string or "no title" for no title
     * @param {string} text
     * @param {string} primaryBtn
     * @param {string} secondaryBtn leave empty string, undefined or "no btn" for no secondary button
     * @returns {Promise<string>} button response
     */
    confirm: (title, text, primaryBtn, secondaryBtn) => {
        //input formatting
        if (title == ("" || "no title")) title = undefined;
        if (secondaryBtn == (undefined || "" || "no btn"))
            secondaryBtn = undefined;

        //create container
        var dialogContainer = document.createElement("div");
        dialogContainer.classList.add("dialogContainer");
        dialogContainer.style.opacity = 0;
        document.body.prepend(dialogContainer);

        //create the actual pop up dialog
        dialogContainer.innerHTML = `
        <div class='dialog'>
            <div class='dialogText'>
                <h3>${title ? title : ""}</h3>
                <p></p>
            </div>
            <div class='dialogInput'>
                ${!secondaryBtn ? "" : `<button onclick='buttonPressed("secondary")'>${secondaryBtn}</button>`} 
                <button onclick='buttonPressed("primary")'>${primaryBtn}</button>
            </div>
        </div>
    `; //prettier-ignore

        //adds the text
        document.querySelector(".dialogText p").innerText = text;

        document.querySelector(".dialog").classList.add("appear");
        $(".dialogContainer").fadeTo(200, 1);

        return new Promise((resolve, reject) => {
            clickPrimary = (event) => {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    event.stopPropagation();
                    buttonPressed("primary");
                }
            };

            document.addEventListener("keydown", clickPrimary, {capture: true});

            buttonPressed = (response) => {
                if (response == "primary") resolve(primaryBtn);
                if (response == "secondary") reject(secondaryBtn);

                document.removeEventListener("keydown", clickPrimary);

                document.querySelector(".dialog").classList.remove("appear");
                $(".dialogContainer").fadeTo(200, 0);
                setTimeout(() => {
                    document.body.removeChild(dialogContainer);
                }, 300);
            };
        });
    },
    /**
     * **presents a custom prompt dialog for user input**
     * @param {string} title leave empty string or "no title" for no title
     * @param {string} text
     * @returns {Promise<string>} input value
     */
    prompt: (title, text) => {
        //input formatting
        if (title == ("" || "no title")) title = undefined;

        //create container
        var dialogContainer = document.createElement("div");
        dialogContainer.classList.add("dialogContainer");
        dialogContainer.style.opacity = 0;
        document.body.prepend(dialogContainer);

        //create the actual pop up dialog
        dialogContainer.innerHTML = `
        <div class='dialog'>
            <div class='dialogText prompt'>
                <h3>${title ? title : ""}</h3>
                <p>${text}</p>
            </div>
            <div class='dialogInput prompt'>
                <input class="promptInput" type="text">
                <button onclick='buttonPressed()'>OK</button>
            </div>
        </div>
        `; //prettier-ignore

        //focus the input field for faster workflow
        document.querySelector(".promptInput").select();

        document.querySelector(".dialog").classList.add("appear");
        $(".dialogContainer").fadeTo(200, 1);

        return new Promise((resolve, reject) => {
            click = (event) => {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    event.stopPropagation();
                    buttonPressed();
                }
            };

            document.addEventListener("keydown", click, {capture: true});

            buttonPressed = () => {
                let input = document.querySelector(".promptInput").value;
                resolve(input);

                document.removeEventListener("keydown", click);

                document.querySelector(".dialog").classList.remove("appear");
                $(".dialogContainer").fadeTo(200, 0);
                setTimeout(() => {
                    document.body.removeChild(dialogContainer);
                }, 300);
            };
        });
    },
    /**
     * **presents a custom prompt dialog for a slider input**
     * @param {string} title leave empty string or "no title" for no title
     * @param {string} text
     * @returns {Promise<number>} input value
     */
    slider: (title, text, callback) => {
        //input formatting
        if (title == ("" || "no title")) title = undefined;

        //create container
        var dialogContainer = document.createElement("div");
        dialogContainer.classList.add("dialogContainer");
        dialogContainer.style.opacity = 0;
        document.body.prepend(dialogContainer);

        //create the actual pop up dialog
        dialogContainer.innerHTML = `
        <div class='dialog'>
            <div class='dialogText prompt'>
                <h3>${title ? title : ""}</h3>
                <p>${text}</p>
            </div>
            <div class='dialogInput prompt'>
                <input class="sliderInput" type="range" value="${root.style.getPropertyValue("--primary-clr-hue")}" min="0" max="360">
                <button onclick='buttonPressed()'>OK</button>
            </div>
        </div>
        `; //prettier-ignore

        const sliderInput = document.querySelector(".sliderInput");
        sliderInput.oninput = () => {
            callback(sliderInput.value)
        };

        document.querySelector(".dialog").classList.add("appear");
        $(".dialogContainer").fadeTo(200, 1);

        return new Promise((resolve, reject) => {
            click = (event) => {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    event.stopPropagation();
                    buttonPressed();
                }
            };

            document.addEventListener("keydown", click, {capture: true});

            buttonPressed = () => {
                let input = document.querySelector(".sliderInput").value;
                resolve(input);

                document.removeEventListener("keydown", click);

                document.querySelector(".dialog").classList.remove("appear");
                $(".dialogContainer").fadeTo(200, 0);
                setTimeout(() => {
                    document.body.removeChild(dialogContainer);
                }, 300);
            };
        });
    },
};

