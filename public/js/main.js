if (typeof Swiper !== "undefined") {

    const swiper = new Swiper(".swiper", {

    loop: true,

    slidesPerView: 5,
    slidesPerGroup: 5,

    spaceBetween: 20,

    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },

    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },

    breakpoints: {

        0:{
            slidesPerView:1,
            slidesPerGroup:1
        },

        576:{
            slidesPerView:2,
            slidesPerGroup:2
        },

        768:{
            slidesPerView:3,
            slidesPerGroup:3
        },

        992:{
            slidesPerView:4,
            slidesPerGroup:4
        },

        1200:{
            slidesPerView:5,
            slidesPerGroup:5
        }

    }

});

}



window.addEventListener("DOMContentLoaded", () => {

    const bars = document.querySelectorAll(".progress-fill");

    bars.forEach((bar, index) => {

        const progress = bar.style.getPropertyValue("--progress");

        setTimeout(() => {
            bar.style.width = progress;
        }, index * 120);

    });

});

const powerCard = document.querySelector(".power-card");

if (powerCard) {

    powerCard.addEventListener("mouseenter", () => {

        const bars = document.querySelectorAll(".progress-fill");

        bars.forEach((bar, index) => {

            const width = bar.style.getPropertyValue("--progress");

            bar.style.width = "0";

            setTimeout(() => {
                bar.style.width = width;
            }, index * 120);

        });

    });

}



const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

console.log(menuToggle);
console.log(navMenu);

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {

        console.log("Hamburger Clicked");

        menuToggle.classList.toggle("active");
        navMenu.classList.toggle("active");

    });
}