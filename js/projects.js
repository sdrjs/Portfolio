"use strict";

const projectsSortButton = document.querySelector('.projects__sort');
const projectElems = document.querySelectorAll('.card');

const projectElemsInvisible = [...projectElems];
const animateProjectsVisibleItems = animateVisibleItems({
    elems: projectElemsInvisible, 
    handler(item) { 
        item.classList.add('fade-in');
    },
    topGap: document.querySelector('.header').offsetHeight,
});

window.addEventListener('resize', resizeProjectsAnimation);
function resizeProjectsAnimation(e) {
    if (projectElemsInvisible.length === 0) {
        window.removeEventListener('resize', resizeProjectsAnimation);
    } else {
        animateProjectsVisibleItems();
    }
}

projectsSortButton.addEventListener('click', e => {
    projectElemsInvisible.forEach(elem => elem.classList.add('fade-in', 'force-init'));
    projectElemsInvisible.length = 0;
}, {once: true});

projectsSortButton.addEventListener('click', sortItems({
    itemsToSort: projectElems, 
    sortButton: projectsSortButton, 
    sortFn(a, b) {
        const [aDay, aMonth, aYear] = a.dataset.release.split('-');
        const [bDay, bMonth, bYear] = b.dataset.release.split('-');

        const aDate = new Date(aYear, aMonth - 1, aDay);
        const bDate = new Date(bYear, bMonth - 1, bDay);

        return bDate - aDate;
    }, 
    before(item) {
        item.classList.add('no-hover');
    },
    after(item) {
        item.classList.remove('no-hover');
    },
    totalVisualizationTime: 400,
    visualizateIfAllVisible: true, 
}));