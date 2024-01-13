"use strict";

const aboutTitleElem = document.querySelector('.about__title');
const aboutContentElem = document.querySelector('.about__content');

const aboutItems = Array.from(aboutContentElem.children);
aboutContentElem.innerHTML = '';
aboutContentElem.classList.add('init');

aboutTitleElem.addEventListener('transitionend', animationStartHandler);

function animationStartHandler(e) {
    if (e.target.tagName === 'SPAN' && e.target.nextElementSibling === null) {
        animateTextTyping();
        aboutTitleElem.removeEventListener('transitionend', animationStartHandler);
    }
}

function animateTextTyping() {
    if (aboutItems.length === 0) return;

    const text = aboutItems.shift().textContent;
    let p = document.createElement('p');
    aboutContentElem.append(p);

    linearRecursiveAnimation({
        draw(progress) {
            let newLength = Math.ceil(text.length * progress);
            p.textContent = text.slice(0, newLength);
        },
        duration: text.length * 25,
        after: animateTextTyping,
        timeout: 250,
    });
}

function linearRecursiveAnimation({draw, duration, after, timeout = 0}) {
    let start = performance.now();

    requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        draw(timeFraction);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        } else if (after !== undefined) {
            setTimeout(after, timeout);
        }
    });
}