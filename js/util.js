"use strict";

/*
    functions:
        1. animateVisibleItems
        2. throttle
        3. sortItems
*/

function animateVisibleItems({elems, handler, topGap = 0, fullVisible = false}) {
/*
    elems - NodeList / HTMLCollection / array of elements which should be tracked
    handler - function with one argument, that is called once element becomes visible
    topGap - size of additional space in top of screen that doesn't count (helpful for fixed header)
    fullVisible - flag that defines when handler will be called
        true for elements that are entirely visible
        false for elements that are partially visible

    returns inner function to handle cases when elements appear on screen not by scroll event
*/
    const items = Array.isArray(elems) ? elems : Array.from(elems);

    window.addEventListener('scroll', handleVisibleItems);
    handleVisibleItems();

    function handleVisibleItems() {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const cords = item.getBoundingClientRect();
    
            let isVisible = fullVisible 
                ? cords.bottom < window.innerHeight && cords.top > topGap 
                : cords.top < window.innerHeight && cords.bottom > topGap
            ;
        
            if (isVisible) {   
                handler(item);

                items.splice(i, 1);
                i--;
                if (items.length === 0) {
                    window.removeEventListener('scroll', handleVisibleItems);
                }
            }
        }
    }

    return handleVisibleItems;
}

function throttle(fn, ms) {
    let isThrottled = false;
    let savedArgs;
    let savedThis;
  
    function wrapper() {
        if (isThrottled) {
            savedArgs = arguments;
            savedThis = this;
            return;
        }
  
    fn.apply(this, arguments);
  
    isThrottled = true;
  
    setTimeout(function() {
        isThrottled = false;
        if (savedArgs) {
            wrapper.apply(savedThis, savedArgs);
            savedArgs = null;
        }
        }, ms);
    }
  
    return wrapper;
}

function sortItems({
    itemsToSort, // non empty iterable object
    sortButton, 
    sortFn, 
    totalVisualizationTime = 0, // milliseconds between first and last transition
    visualizateIfAllVisible = false, // if last item is not visible totalVisualizationTime sets to 0
    isDescending = true, // sorting order
    invisibleItems = [], 
    animateVisibleItemsHandler = null, 
    useTwoColumnsDirectionsSwitch = false, 
    switchDirectionsWidth = 768, // min width to use twoColumnsDirectionsSwitch
    before = null, // function that will be called for every item before sort starts
    after = null, // function that will be called for every item after sort finishes
}) {
    const container = itemsToSort[0].parentElement;
    let items = [...itemsToSort];
    const timeBetweenTransition = totalVisualizationTime / (items.length - 1);

    return function(e) {
        if (before) items.forEach(before);
        
        sortButton.disabled = true;

        let timeBetween = timeBetweenTransition;
        if (visualizateIfAllVisible) {
            const lastItemTop = items[items.length - 1].getBoundingClientRect().top;
            const isAllVisible = window.innerHeight - lastItemTop > 0;
            if (!isAllVisible) timeBetween = 0;
        }

        items.sort(sortFn); 
        if (isDescending) items.reverse(); 
    
        if (window.innerWidth >= switchDirectionsWidth && useTwoColumnsDirectionsSwitch) {
            items = switchTwoColumnsDirection(items);
        }
    
        let lastTransitionIdx = null;
    
        items.forEach((item, idx) => {
            const currentCords = item.getBoundingClientRect();
            const targetCords = container.children[idx].getBoundingClientRect();
    
            const diffX = targetCords.left - currentCords.left;
            const diffY = targetCords.top - currentCords.top;
    
            if (diffX === 0 && diffY === 0) return;
            lastTransitionIdx = idx;
    
            setTimeout(() => item.style.transform = `translate(${diffX}px, ${diffY}px)`, timeBetween * idx);
        });
    
        if (lastTransitionIdx === null) {
            finishSort();
            return;
        }

        items[lastTransitionIdx].addEventListener('transitionend', transitionEndHandler);
    }

    function transitionEndHandler(e) {
        if (e.propertyName !== 'transform') return;
        if (e.target !== e.currentTarget) return;

        container.append(...items);
        items.forEach(item => item.style.transform = '');
        e.currentTarget.removeEventListener('transitionend', transitionEndHandler);
        finishSort();
    }

    function finishSort() {
        sortButton.disabled = false;
        isDescending = !isDescending;
        if (invisibleItems.length !== 0 && animateVisibleItemsHandler) animateVisibleItemsHandler();
        if (after) items.forEach(after);
    }
    
    function switchTwoColumnsDirection(arr) {
        const half = Math.ceil(arr.length / 2);
        const left = [];
        const right = [];
    
        for (let i = 0; i < arr.length; i++) {
            i < half ? left.push(arr[i]) : right.push(arr[i]);
        }
    
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            i & 1 ? result.push(right.shift()) : result.push(left.shift()); // i % 2 !== 0
        }
    
        return result; // [1, 2, 3, 4, 5, 6, 7] -> [1, 5, 2, 6, 3, 7, 4]
    }
}