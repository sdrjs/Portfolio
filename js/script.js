"use strict";

const homeButton = document.querySelector('.home__button');
homeButton.addEventListener('click', function(e) {
    document.querySelector('._section').scrollIntoView({behavior: "smooth"});
});