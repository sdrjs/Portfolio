"use strict";

const themeContainer = document.querySelector('.theme-switch');
themeContainer.insertAdjacentHTML('beforeend', `
    <input type="checkbox" id="theme-checkbox">
    <label for="theme-checkbox">
        <div class="theme-switch__stars">
            <div class="theme-switch__star theme-switch__star_1">★</div>
            <div class="theme-switch__star theme-switch__star_2">★</div>
        </div>
        <div class="theme-switch__moon"></div>
    </label>
`);

const themeElem = document.getElementById('theme-checkbox');
let theme = localStorage.getItem("theme");

if (theme === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme = "dark";
}

if (theme === "dark") {
    document.body.classList.add("dark-theme");
    themeElem.checked = true;
}

const themeImages = document.querySelectorAll('[data-theme]');
themeImages.forEach(setImageSrc);

themeElem.addEventListener("change", () => {
    document.body.classList.toggle("dark-theme");
    
    if (theme === "dark") {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "dark");
    }
    
    theme = localStorage.getItem("theme");
    themeImages.forEach(setImageSrc);
});

function setImageSrc(img) {
    let src = img.dataset.theme;

    const filetype = src.match(/\.[^.]+$/)[0];
    if (theme === 'dark') {
        src = src.replace(filetype, `-dark${filetype}`);
    }

    img.src = src;
}