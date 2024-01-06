"use strict";

document.fonts.ready.then(() => {
    const smallTitles = [];
    const largeTitles = [];
    
    let isSmallScreen = window.innerWidth <= 767;
    
    const sectionTitles = document.querySelectorAll('._title');
    sectionTitles.forEach(title => {
        largeTitles.push(title.offsetWidth);
        title.classList.add('small');
        smallTitles.push(title.offsetWidth);
        if (!isSmallScreen) title.classList.remove('small');

        title.style.width = title.offsetWidth + 1 + 'px';
        title.classList.add('init');

        const text = title.textContent;
        title.innerHTML = '';
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            title.append(span);
        }
    });

    animateVisibleItems({
        elems: document.querySelectorAll('._title'), 
        handler(item) { 
            const letters = item.querySelectorAll('span');
            const lettersCount = letters.length;
            const totalVisualizationTime = 500;
            const timeBetweenEach = totalVisualizationTime / (lettersCount - 1);

            for (let i = 0; i < lettersCount; i++) {
                setTimeout(() => letters[i].classList.add('init'), timeBetweenEach * i);

                letters[i].addEventListener('transitionend', e => letters[i].classList.add('active'), {once: true});
            }

            setTimeout(() => item.classList.add('active'), totalVisualizationTime + 350);
        }, 
        topGap: document.querySelector('.header').offsetHeight,
        fullVisible: true,
    });

    window.addEventListener('resize', function(e) {
        const isCurrentScreenSmall = window.innerWidth <= 767;
    
        if (isCurrentScreenSmall !== isSmallScreen) {
            isSmallScreen = !isSmallScreen;
            sectionTitles.forEach((title, idx) => {
                title.classList.toggle('small');
                title.style.width = isSmallScreen ? smallTitles[idx] + 1 + 'px' : largeTitles[idx] + 1 + 'px';
            });
        }
    });
}); // alternative: document.fonts.load('1rem "Rubik Scribble"').then(() => {})