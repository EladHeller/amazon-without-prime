import browser from './browser'
import stringProvider from './stringProvider';

let currPrimeItems = [];
let cardItems = document.querySelectorAll(stringProvider.cardContainer);
let usedCardItems = [];
let usedCarouselButtons = [];

const init = ()=> {
    browser.storage.onChanged.addListener(storageChanged);
    
    const resultsContainer = document.getElementById(stringProvider.resContainer);
    if (resultsContainer) {
        removePrimeResults();
        const observer = new MutationObserver(observeFunction);
        observer.observe(resultsContainer, { childList: true, subtree: true });
    }
    findCardItems(0);
}
const removeCardItems = ()=>{
    cardItems= document.querySelectorAll(stringProvider.cardContainer);
    if (cardItems.length){
        removePrimeResults();
        const unusedCardItems = [];
        cardItems.forEach(card=>{
            if (usedCardItems.every(usedCard=> usedCard !== card)){
                unusedCardItems.push(card);
            }
        });
        for (let cardItem of unusedCardItems){
            const observer = new MutationObserver(observeFunction);
            observer.observe(cardItem, { childList: true, subtree: true });
            usedCardItems.push(cardItem);
        }
    }
}
const listenCarouselButtons = ()=>{
    const carouselButtons = document.querySelectorAll(stringProvider.carouselButton);
    const unusedCarouselButtons = [];
    carouselButtons.forEach(btn=>{
        if (usedCarouselButtons.every(usedBtn=> usedBtn !== btn)){
            unusedCarouselButtons.push(btn);
        }
    });
    for (let btn of unusedCarouselButtons){
        btn.addEventListener('click',()=>{
            setTimeout(()=>{
                usedCardItems = [];
                removeCardItems();                
            },500);
        });
        usedCarouselButtons.push(btn);
    }
}
const findCardItems = (i)=>{
    removeCardItems();
    listenCarouselButtons();
    if (i < 20) {
        setTimeout(findCardItems, 500, ++i);
    }
}

const changePrimeItemsDispaly = (primeItems, show) => {
    for (let item of primeItems) {
        setTimeout(function() {
            item.style.display = show ? 'inline-block' : 'none';
        });
    }
    for (let item of cardItems) {
        if (!show && (primeItems.indexOf(item) === -1)) {
            setTimeout(function() {
                item.style.display = 'inline-block';
            });
        }
    }
}

const removePrimeResults=()=>{
    currPrimeItems = [];
    const searchItems = document.querySelectorAll(stringProvider.resSelector);
    for (let searchItem of searchItems){
        if (searchItem.querySelector(stringProvider.primeClass)){
            currPrimeItems.push(searchItem);
        }
    }
    for (let cardItem of cardItems){
        if (cardItem.querySelector(stringProvider.primeClass)){
            currPrimeItems.push(cardItem);
        }
    }

    browser.storage.local.get(stringProvider.isActive,(data)=>{
        if (data.isActive) {
            changePrimeItemsDispaly(currPrimeItems, false);
        }
    });
}

const observeFunction=(mutations) =>{
    let nodePrimeAdded = false; 
    mutations.some(function(mutation) {
        for (let node of mutation.addedNodes){
            if (node.querySelector && node.querySelector(stringProvider.primeClass)){
                nodePrimeAdded = true;
                break;
            }
        }

        return nodePrimeAdded;
    });
    
    if (nodePrimeAdded){
        setTimeout(removePrimeResults, 200);
    }
}

const storageChanged=(changes, areaName)=>{
    if (stringProvider.isActive in changes) {
        changePrimeItemsDispaly(currPrimeItems, !changes.isActive.newValue);
    }
}

init();