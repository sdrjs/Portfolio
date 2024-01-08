"use strict";

const header = document.querySelector('.header');
const burgerMenu = document.querySelector('.menu__burger');
const menuBody = document.querySelector('.menu__body');
const menuList = header.querySelector('.menu__list');

highlightActiveLink();
window.addEventListener('scroll', throttle(highlightActiveLink, 100));
burgerMenu.addEventListener('click', scrollThenToggle);
menuList.addEventListener('click', scrollToSection);

function highlightActiveLink(e) {
    const links = menuList.querySelectorAll('.menu__link');

    const fullScreen = window.innerHeight;
    const halfScreen = window.innerHeight / 2;

    const isBottomScrolled = document.documentElement.scrollHeight - window.scrollY - window.innerHeight === 0 ? true : false;
    // footer may be smaller than half of screen

    for (const link of links) {
        const section = document.querySelector(`.${link.getAttribute('href')}`);
        const cords = section.getBoundingClientRect();
        const isActiveElem = isBottomScrolled 
            ? cords.top <= fullScreen && cords.bottom + 1 >= fullScreen
            : cords.top <= halfScreen && cords.bottom >= halfScreen
        ;

        if (isActiveElem) {
            link.classList.add('active');
        } else {
            link.classList.remove('active')
        }
    }
}

function scrollThenToggle(e) {
    const cords = header.getBoundingClientRect();
    if (cords.top === 0) {
        toggleMenu();
        return;
    }

    header.scrollIntoView({behavior: "smooth"});
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('pointerdown', cancelScroll);

    function checkScroll(e) {
        const cords = header.getBoundingClientRect();
        if (cords.top !== 0) return;

        cancelScroll();
        toggleMenu();
    }

    function cancelScroll() {
        window.removeEventListener('scroll', checkScroll);
        window.removeEventListener('pointerdown', cancelScroll);
    }
}

function scrollToSection(e) {
    if (!e.target.classList.contains('menu__link')) return;
    e.preventDefault();

    const target = document.querySelector(`.${e.target.getAttribute('href')}`);
    target.scrollIntoView({behavior: "smooth"});

    if (burgerMenu.classList.contains('active')) toggleMenu();
}

function toggleMenu(e) {
    menuBody.classList.toggle('active');
    burgerMenu.classList.toggle('active');

    if (document.body.style.overflow === '') {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}