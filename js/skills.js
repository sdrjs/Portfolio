"use strict";

const skillsSortButton = document.querySelector('.skills__sort');
const skillsItems = document.querySelectorAll('.skills__item');

skillsItems.forEach(setColor)

const skillsItemsInvisible = [...skillsItems];
const animateSkillsVisibleItems = animateVisibleItems({
    elems: skillsItemsInvisible, 
    handler(item) {
        const progressElem = item.querySelector('.item-skills__progress');
        progressElem.style.width = item.dataset.knowledge + '%';
    },
    topGap: document.querySelector('.header').offsetHeight,
});

skillsSortButton.addEventListener('click', sortItems({
    itemsToSort: skillsItems, 
    sortButton: skillsSortButton, 
    sortFn(a, b) {
        return a.dataset.knowledge - b.dataset.knowledge;
    }, 
    invisibleItems: skillsItemsInvisible, 
    animateVisibleItemsHandler: animateSkillsVisibleItems, 
    useTwoColumnsDirectionsSwitch: true,
    totalVisualizationTime: 700,
}));

function setColor(item) {
    const label = item.querySelector('.item-skills__label');
    const progressBar = item.querySelector('.item-skills__progressbar');
    const progress = item.querySelector('.item-skills__progress');

    let color = getComputedStyle(document.documentElement).getPropertyValue(`--${item.dataset.skill}`).trim();
    if (color === '' || !color.startsWith('hsl')) color = 'hsl(0, 0%, 45%)';

    const lightnessRegex = /\d+(?=%\))/;
    const lightness = +color.match(lightnessRegex)[0];

    const bgColor = color.replace(lightnessRegex, lightness + 30);
    const labelColor = color.replace(lightnessRegex, lightness + 5);
    const borderColor = color.replace(lightnessRegex, lightness - 10);

    label.style.background = labelColor;
    label.style.borderRight = `2px solid ${borderColor}`;
    progress.style.background = color;
    progressBar.style.background = bgColor;
}