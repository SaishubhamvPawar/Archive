const swiper = new Swiper(".swiper", {

    loop: true,

    spaceBetween: 15,

    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },

    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },

    grid: {
        rows: 3,
        fill: "row"
    },

    breakpoints: {

        0: {
            slidesPerView: 1,
            slidesPerGroup: 1,
            grid: {
                rows: 1
            }
        },

        576: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            grid: {
                rows: 2
            }
        },

        768: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            grid: {
                rows: 2
            }
        },

        992: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            grid: {
                rows: 2
            }
        },

        1200: {
            slidesPerView: 5,
            slidesPerGroup: 5,
            grid: {
                rows: 3
            }
        }

    }

});

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