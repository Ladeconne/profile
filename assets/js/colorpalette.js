//Global variables, selectors
//Color panels with sliders
const colorDivs = document.querySelectorAll('.color');
const sliders = document.querySelectorAll('.sliders');
const hexTexts = document.querySelectorAll(".color h2");
//Color panels buttons
const equalizers = document.querySelectorAll(".equalizer");
const locks = document.querySelectorAll(".unlocked");
//Close slider button
const closeSliders = document.querySelectorAll(".close-sliders");
//Bottom control buttons
const refresh = document.querySelector('.refresh');
const save = document.querySelector('.save');
const lib = document.querySelector('.lib');
//Panel for popups
const copyPanel = document.querySelector(".copy-panel");
const savePanel = document.querySelector(".save-panel");
const libPanel = document.querySelector(".lib-panel");
//Close popup
const closePopups = document.querySelectorAll(".close-popup");
//Save submit button
const saveSubmit = document.querySelector(".save-submit");
//Save submit text input
const saveInput = document.querySelector(".save-input");
//Clear lib
const clearLibBtn = document.querySelector(".clear-lib");

let initialColors;
let savedPalettes = [];

// Event listeners
sliders.forEach((slide) => slide.addEventListener("input", updateBackground));

refresh.addEventListener("click", refreshColors);

save.addEventListener("click", savePopup);

lib.addEventListener("click", libPopup);

hexTexts.forEach((h2 => {
    h2.addEventListener("click", () => {
        copyToClipboard(h2.innerText);
        copyPanel.classList.add("active");
        copyPanel.children[0].classList.add("active");
    });
}))

copyPanel.addEventListener("transitionend", () => {
    copyPanel.classList.remove("active");
    copyPanel.children[0].classList.remove("active");
})

equalizers.forEach((equalizer, index) => {
    equalizer.addEventListener("click", () => openEqualizerAdjustement(index))
})
closeSliders.forEach((closeSlider, index) => {
    closeSlider.addEventListener("click", () => openEqualizerAdjustement(index))
})

locks.forEach((lock, index) => {
    lock.addEventListener("click", () => lockUnlock(lock))
})

closePopups.forEach((closePopup) => {closePopup.addEventListener("click", ()=>{
    savePanel.classList.remove("active");
    savePanel.children[0].classList.remove("active");
    libPanel.classList.remove("active");
    libPanel.children[0].classList.remove("active");
    })
})

saveSubmit.addEventListener("click", savePalette);

clearLibBtn.addEventListener("click", clearLocalStorage);

//Function

//Generate a Hex code when called.
// I could also delete this function and directly called "chroma.random()" when defining "newColor"
function generateHex() {
    const generatedHex = chroma.random();
    return generatedHex;
}

function randomColor(){

    //On stock les valeurs initales
    initialColors = [];

    //Loop on every color panels
    colorDivs.forEach((div, index) =>{
        //Generate a new Hex code by calling the function
        const newColor = generateHex();

        //Je récupère les h2 avant la boucle if afin de conserver la valeur hex avant le lock
        const colorDivHex = div.children[0];

        if(div.children[1].children[1].classList.contains("unlocked")){
            initialColors.push(chroma(newColor).hex());
        } else {
            initialColors.push(colorDivHex.innerText);
            return
        }
       
        
        //Je récupère les controls boutton de chaque div
        const divControls = div.querySelectorAll(".color-controls button");

        //Changing the Hex value and the background of each div
        colorDivHex.innerText = newColor;
        div.style.background = newColor;

        //change text and icon contrast if needed
        checkTextContrast(colorDivHex, newColor);
        divControls.forEach((control) => {
            checkTextContrast(control, newColor)
        })

        //Selecting sliders for each color
        const sliders = div.querySelectorAll('input[type="range"]')
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];
        
        //Initializing ranges sliders
        initializeSliders(newColor, hue, brightness, saturation)

    })
    
}

function checkTextContrast(text, color){
    const colorLum = chroma(color).luminance();
    if(colorLum < 0.5){
        text.style.color = 'rgba(255, 255, 255, 0.874)';
    }else{
        text.style.color = 'rgba(0, 0, 0, 0.794)';
    }
}

function initializeSliders(newColor, hue, brightness, saturation){
    hue.value = newColor.hsl()[0];
    saturation.value = newColor.hsl()[1];
    brightness.value = newColor.hsl()[2];
    
    //Brightness
    const startBri = chroma(newColor).set("hsl.l", 0);
    const endBri = chroma(newColor).set("hsl.l", 1);
    const scaleBri = chroma.scale([startBri,newColor, endBri])
    brightness.style.background = `linear-gradient(to right, ${scaleBri(0)},${scaleBri(0.5)},${scaleBri(1)})`
    
    //Saturation
    const startSat = chroma(newColor).set("hsl.s", 0);
    const endSat = chroma(newColor).set("hsl.s", 1);
    const scaleSat = chroma.scale([startSat,newColor, endSat])
    saturation.style.background = `linear-gradient(to right, ${scaleSat(0)},${scaleSat(0.5)},${scaleSat(1)})`

    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

function updateBackground(e){
     //Je regarde sur quel panel je suis en regardant les attributs que l'on rempli dans chaque range
    const index = e.target.getAttribute("data-hue") ||
    e.target.getAttribute("data-brightness") ||
    e.target.getAttribute("data-saturation");

    //Je récupère la value sur laquelle je me suis arrêté
    const newValue = e.target.value;

    //Je récupère la couleur du background initiale
    const color = initialColors[index];
    
    switch(e.target.name){
        case "hue":
            colorDivs[index].style.background = chroma(color).set("hsl.h", newValue);
            break;
        case "brightness":
            colorDivs[index].style.background = chroma(color).set("hsl.l", newValue);
            break;
        case "saturation":
            colorDivs[index].style.background = chroma(color).set("hsl.s", newValue);
            break;
    }

    const updatedBgColor =colorDivs[index].style.background;
   
    //Je change la valuer de Hex affiché dans le h2
    const hexText = colorDivs[index].querySelector("h2");
    hexText.innerText = chroma(updatedBgColor);
    // Je check le contrast du h2
    checkTextContrast(hexText ,updatedBgColor);
    
    //Je récupère les bouttons dans le div concerné
    const divControls = colorDivs[index].querySelectorAll(".color-controls button")
    //Je check le contrast pour tous les bouttons 
    divControls.forEach((control) => {
        checkTextContrast(control, updatedBgColor)
    })
    const sliders = colorDivs[index].querySelectorAll('input[type="range"]')
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    
    initializeSliders(chroma(updatedBgColor), hue, brightness, saturation);
    
    initialColors[index] = chroma(updatedBgColor).hex();
}
function refreshColors(){
    initialColors = [];
    randomColor()
}

function copyToClipboard(hex){
    //je crée un element temporaire
    const el = document.createElement("textarea")
    el.innerText = hex;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function openEqualizerAdjustement(index){
    sliders[index].classList.toggle("active");
}
function closeEqualizerAdjustement(index){
    sliders[index].classList.remove("active");
}

function lockUnlock(lock) {
    if(lock.classList.contains("unlocked")){
        lock.classList.remove("unlocked");
        lock.classList.add("locked");
        lock.innerHTML = `<i class="fas fa-lock"></i>`;
    }else{
        lock.classList.remove("locked");
        lock.classList.add("unlocked");
        lock.innerHTML = `<i class="fas fa-lock-open"></i>`;
    }
}

function savePopup(){
    savePanel.classList.add("active");
    savePanel.children[0].classList.add("active");
}

function libPopup(){
    libPanel.classList.add("active");
    libPanel.children[0].classList.add("active");
}
function savePalette(){
    savePanel.classList.remove("active");
    savePanel.children[0].classList.remove("active");
    const paletteName = saveInput.value;
    const paletteContent = [...initialColors];
    let paletteNr;
    if(localStorage.getItem("palettes") === null){
        paletteNr = savedPalettes.length;
    }else{
        const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
        paletteNr = paletteObjects.length;
    }

    const paletteObj = {name: paletteName, color: paletteContent, nr: paletteNr};

    savedPalettes.push(paletteObj);
    //save to local storage
    saveToLocal(paletteObj);
    saveInput.value = "";

    //ajouter la palette dans la librairy
    addToLib(paletteObj);

}

function saveToLocal(paletteObj){
    let localPalette;
    if(localStorage.getItem("palettes") === null){
        localPalette = []
    }else{
        localPalette = JSON.parse(localStorage.getItem("palettes"));
    }
    localPalette.push(paletteObj);
    localStorage.setItem("palettes", JSON.stringify(localPalette));

}

function addToLib(paletteObj){
    //Je reprends les elements de la palette
    const name = paletteObj.name;
    const colors = paletteObj.color;
    const nr = paletteObj.nr;

    if(localStorage.getItem("palettes") === null){
        localStorage = []
    }else{
        localStorage = JSON.parse(localStorage.getItem("palettes"));
    }
        //Le panneau dans lequel on va trouver l'ensemble des palettes sauvegardées
        const palettePanel = document.createElement("div");
        palettePanel.classList.add("palette-panel");

        //Le titre de la palette
        const paletteTitle = document.createElement("h4");
        paletteTitle.classList.add("palette-title");
        paletteTitle.innerText = name;
        //Le block de preview dans lequel il y a chaques couleurs
        const colorsPreview = document.createElement("div");
        colorsPreview.classList.add("colors-preview");

        //Pour chaque couleur on crée un div que l'on va colorer
        colors.forEach((color) =>{
            const colorBlock = document.createElement("div");
            colorBlock.classList.add("color-block");
            colorBlock.style.background = color;
            colorsPreview.appendChild(colorBlock);
        })
        //le bouton select à côté des couleurs
        const colorSelect = document.createElement("INPUT");
        colorSelect.setAttribute("type", "submit");
        colorSelect.classList.add("color-select");
        colorSelect.classList.add(nr);
        colorSelect.value = "Select";
        colorsPreview.appendChild(colorSelect);

        //Je rajoute la logique derrière le bouton select
        colorSelect.addEventListener("click", (e) => {
            libPanel.classList.remove("active");
            libPanel.children[0].classList.remove("active");
            const paletteIndex = e.target.classList[1];
            initialColors =[];
            paletteObj.color.forEach((color, index) => {
                initialColors.push(color);
                colorDivs[index].style.background = color;
                const text = colorDivs[index].children[0];
                text.innerText = color;

                //mise à jour des sliders
                const sliders = colorDivs[index].querySelectorAll('input[type="range"]')
                const hue = sliders[0];
                const brightness = sliders[1];
                const saturation = sliders[2];
    
                initializeSliders(chroma(color), hue, brightness, saturation);
                
            })

        })
    

        //On attache tout ça à element existant :)
        libPanel.children[0].appendChild(palettePanel);
        palettePanel.appendChild(paletteTitle);
        palettePanel.appendChild(colorsPreview);

}

function getLocal(){
    if(localStorage.getItem("palettes") === null){
        localStorage = [];
    }else{
        const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
        paletteObjects.forEach((paletteObj) =>{
            addToLib(paletteObj);
        })
    }

}

function clearLocalStorage(){
    localStorage.clear();
    const palettePanels = document.querySelectorAll(".palette-panel")
    palettePanels.forEach((palettePanel)=>{
        libPanel.children[0].removeChild(palettePanel);
    }
    )
    libPanel.classList.remove("active");
    libPanel.children[0].classList.remove("active");
}
getLocal()

randomColor();