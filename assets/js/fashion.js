//const controller = new ScrollMagic.Controller();
let controller;
let slideScene;
let pageScene;
let detailSlideScene;

//Animation slides
function animateSlides() {
    //Init controller
    controller = new ScrollMagic.Controller();
    //Select document objects
    const slides = document.querySelectorAll('.slide');
    const nav = document.querySelector(".nav-header");
    //Loop of the slides
    slides.forEach((slide,index,slides) => {
        //Select element of the slide
        revealImg = slide.querySelector(".reveal-img");
        img = slide.querySelector("img");
        revealText = slide.querySelector(".reveal-text");

        //Gsap timeline
        const slideTl = gsap.timeline({defaults:{duration:1, ease: "power2.out"}});
        //GSAP
        slideTl.fromTo(revealImg, {x:"0%"}, {x:"100%"});
        slideTl.fromTo(img, {scale:1.5}, {scale :1}, "-=0.8");
        slideTl.fromTo(revealText, {x:"0%"}, {x:"100%"}, "-=0.5" );
        slideTl.fromTo(nav, {y:"-100%"}, {y:"0%"});

        //Create scene
        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            triggerHook: 0.25,
            reverse: false
        })
        //.addIndicators({colorStart: "white", colorTrigger:"white", name:"slide"})
        .setTween(slideTl)
        .addTo(controller);

        //New timeline
        const pageTl = gsap.timeline();
        //pushing the next slide so the slide have a scroll area where it does not move
        let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];

        //gsap
        //pushing the next slide
        pageTl.fromTo(nextSlide, {y : "0%"}, {y : "50%"});
        pageTl.fromTo(slide, {opacity: 1, scale: 1}, {opacity: 0, scale: 0.3});
        pageTl.fromTo(nextSlide, {y : "50%"}, {y : "0%"});

        //new Scene
        pageScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: "100%",
            triggerHook: 0
        })
        //.addIndicators({colorStart: "white", colorTrigger: "white", name: "page", indent: 100})
        .setPin(slide, {pushFollowers: false})
        .setTween(pageTl)
        .addTo(controller);


    })
}

//Animations page Fashion
function animationdetailSlide(){
    //Création du controller
    controller = new ScrollMagic.Controller();
    //J'ai besoin d'accéder au slide
    const slides = document.querySelectorAll(".detail-slide");

    slides.forEach((slide,index,slides) => {
        //Je défini la "Next slide"
        let nextSlide = slides.length - 1 === index ? "End" : slides[index + 1];
        //Je récupère la next img
        nextImg = nextSlide.querySelectorAll(".fashion-img");
        //Création de la timeline
        const fashionTl = gsap.timeline({defaults:{duration:1, ease: "power2.out"}});

        //on crée l'animation avec gsap
        fashionTl.fromTo(slide, {opacity:1}, {opacity:0});
        fashionTl.fromTo(nextSlide, {opacity:0}, {opacity:1}, "-=1");
        fashionTl.fromTo(nextImg, {x:"50%"}, {x:"0%"},"-=1.2");
        //On crée la scene
        detailSlideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: "100%",
            triggerHook: 0
        })//.addIndicators()
        .setPin(slide, {pushFollowers:false})
        .setTween(fashionTl)
        .addTo(controller);
    })


}

//Accesseurs
const mouse = document.querySelector(".cursor");
const mouseText = mouse.querySelector("span");
const burger = document.querySelector(".burger");

//Event Functions
function cursor(e){
    let mouse = document.querySelector(".cursor");
    mouse.style.top = e.pageY + "px";
    mouse.style.left = e.pageX + "px";
}

function cursorover(e){
    //Defini l'element ciblé par la souris
    let itemOver = e.target;
    //Si la cible est le logo ou le burget, on ajout une classe nav pour remplir le cursor en bleu et grossir
    if(itemOver.id === "logo" || itemOver.className ==="burger"){
        mouse.classList.add("nav-over");
    }else{
        mouse.classList.remove("nav-over");
    }
    //Si la cible est le bouton explore on met un fond blanc et un text "tap"
    if(itemOver.classList.contains("btn")){
        mouse.classList.add("btn-over");
        gsap.to(".title-swipe",1,{y:"0%"});
        mouseText.innerText = "Tap";
    }else{
        mouse.classList.remove("btn-over");
        gsap.to(".title-swipe",1, {y:"100%"});
        mouseText.innerText = "";
    }
}
function expandNav(e){
    if(!e.target.classList.contains("active")){
        burger.classList.add("active");
        gsap.to("#line1", 1, {rotate: "45", y:5, background: "black"})
        gsap.to("#line2", 1, {rotate: "-45", y:-5, background: "black"})
        gsap.to("#logo", 1, {color: "black"})
        gsap.to(".nav-bar", 1, {clipPath:"circle(2500px at 100% -10%)"})
        document.body.classList.add("hide");
    } else{
        burger.classList.remove("active");
        gsap.to("#line1", 1, {rotate: "0", y:0, background: "white"})
        gsap.to("#line2", 1, {rotate: "0", y:0, background: "white"})
        gsap.to("#logo", 1, {color: "white"})
        gsap.to(".nav-bar", 1, {clipPath:"circle(50px at 100% -10%)"})
        document.body.classList.remove("hide");

    }
}

//Barba page transition
const logo = document.querySelector("#logo");
barba.init({
    views: [
        {
            namespace: "home",
            beforeEnter(){
                animateSlides();
                logo.href = "../fashion.html";
                gsap.fromTo(".nav-header", 1, {y: "-100%"}, {y:"0%", ease: "power2.inOut"})
            },
            beforeLeave(){
                slideScene.destroy();
                pageScene.destroy();
                controller.destroy();
            }

        },
        {
            namespace: "fashion",
            beforeEnter(){
                logo.href = "../fashion.html";
                animationdetailSlide();
            },
            beforeLeave(){
                detailSlideScene.destroy();
                controller.destroy();
            }
        }
    ],
    transitions: [
        {
            leave({current,next}){
                //Indique quand passer de leave à enter
                let done = this.async();
                //remonte en haut de page
                window.scrollTo(0,0);
                //An animation
                const tl = gsap.timeline({defaults: {ease: "power2.inOut"}})
                tl.fromTo(current.container, 1, {opacity:1},{opacity:0});
                //transition swipe
                tl.fromTo(".swipe", 0.3, {x:"-100%"},{x:"0%", onComplete: done}, "-=1");

            },
            enter({current,next}){
                //Indique quand passer de enter à leave
                let done = this.async();
                //An animation
                const tl = gsap.timeline({defaults: {ease: "power2.inOut"}})
                tl.fromTo(next.container, 1, {opacity:0},{opacity:1});
                //transition swipe
                tl.fromTo(".swipe", 0.75, {x:"0%"},{x:"100%", stagger: 0.1, onComplete: done}, "-=0.9");

            }
        }
    ]
});

//EventListeners
burger.addEventListener("click", expandNav);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", cursorover);
