class Drumkit{
    //CONSTRUCTOR
    constructor(){
        this.pads = document.querySelectorAll(".pad");
        this.kickAudio = document.querySelector('.kick-sound');
        this.snareAudio = document.querySelector('.snare-sound');
        this.hihatAudio = document.querySelector('.hihat-sound');
        this.playBtn = document.querySelector(".btn-play");
        this.mutesBtn = document.querySelectorAll(".btn-mute");
        this.selects = document.querySelectorAll(".select");
        this.bpmSlider = document.querySelector(".bpm-slider");
        this.sliderPan = document.querySelector(".slider-pan");
        this.index = 0;
        this.bpm = 150;
        this.isPlaying = null;
    }

    //FUNCTIONS
    selectedPad() {
        this.classList.toggle("active");
    }

    repeat() {
        // création du step, matérialisant la progression dans la track
        let step = this.index % 8;
        
        // Activation de la colonne de pad en fonction de la position du step
        this.pads.forEach(pad => {
            if(pad.classList.contains(`b${step}`)){
                pad.style.animation = 'playTrack 0.3s alternate ease-in-out 2';
                if(pad.classList.contains("active")){
                    if(pad.classList.contains("kick-pad")){
                        this.kickAudio.currentTime= 0;
                        this.kickAudio.play();
                    }
                    if(pad.classList.contains("snare-pad")){
                        this.snareAudio.currentTime= 0;
                        this.snareAudio.play();
                    }
                    if(pad.classList.contains("hihat-pad")){
                        this.hihatAudio.currentTime= 0;
                        this.hihatAudio.play();
                    }
                }         
            }
        });
        // Incrémentation du step
        this.index++;
    }
    
    start() {
        let interval = (60/this.bpm)*1000;
        // if isPlaying exists we clear the interval and set back isPlaying to null
        if(this.isPlaying){
            clearInterval(this.isPlaying);
            this.isPlaying = null;
        }
        else{
        //Storing the number attributed to the interval we lanch in the same time
            const intervalIndex = setInterval(()=>{
                this.repeat();
            }, interval)
        // Storing the interval Index in a global variable to reuse it in global context
            this.isPlaying = intervalIndex;
            console.log(this.isPlaying)
        }
    }
    updateplayBtn(){
        if(this.isPlaying){
            this.playBtn.classList.add("active-play")
            this.playBtn.innerHTML="Stop";
        }else{
            this.playBtn.classList.remove("active-play")
            this.playBtn.innerHTML="Play";
        }
    }
    updatemuteBtn(e){
        const line = e.target.getAttribute("data-track");
        if(e.target.classList.contains("mute-active")){
            switch(line){
                case "0":
                    this.kickAudio.volume = 0;
                    break;
                case "1":
                    this.snareAudio.volume = 0;
                    break;
                case "2":
                    this.hihatAudio.volume = 0;
                    break;
            }
        }else{
            switch(line){
                case "0":
                    this.kickAudio.volume = 1;
                    break;
                case "1":
                    this.snareAudio.volume = 1;
                    break;
                case "2":
                    this.hihatAudio.volume = 1;
                    break;
            }
        }
    }
    changeAudio(e){
        const choiceValue = e.target.value;
        const choiceInst = e.target.name;

        switch(choiceInst){
            case "kick-choice":
                this.kickAudio.src = choiceValue;
                break;
            case "snare-choice":
                this.snareAudio.src = choiceValue;
                break;
            case "hihat-choice":
                this.hihatAudio.src = choiceValue;
                break;
        }

    }
    updateBpm(e){
        const newBpm = e.target.value;
        const spanBpm = document.querySelector(".nr-bpm");
        spanBpm.innerHTML = newBpm;
    }

    changeBpm(e){
        this.bpm = e.target.value;
    clearInterval(this.isPlaying);
    this.isPlaying = null;
    const playBtn = document.querySelector(".btn-play");
    if (playBtn.classList.contains("active-play")) {
      this.start();
    }
}
}

// INITIALIZATION OF DRUMKIT
const drumKit = new Drumkit;

// EVENT LISTENERS
drumKit.pads.forEach(pad => {
    pad.addEventListener("click", drumKit.selectedPad)
    pad.addEventListener('animationend', () => {
        pad.style.animation = "";
    })
})

drumKit.playBtn.addEventListener("click", () => {
    drumKit.start();
    drumKit.updateplayBtn();
});
drumKit.mutesBtn.forEach(btn => {
   btn.addEventListener("click", (e) => {
        btn.classList.toggle("mute-active");
        drumKit.updatemuteBtn(e);
    })
})
drumKit.selects.forEach(btn => {
    btn.addEventListener("change", (e) => {
        drumKit.changeAudio(e);
     })
 })

 drumKit.bpmSlider.addEventListener("input", drumKit.updateBpm)

 drumKit.bpmSlider.addEventListener("change", (e) => {
     drumKit.changeBpm(e);
    }
    )


