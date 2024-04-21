/* eslint-disable no-console */
/** Prevent USERCRIPT advice */
// ==UserScript==

// @name Autoloot Bonus - Twitch.
// @name:de Autoloot Bonus - Twitch.

// @description		Automaticaly claim bonus points from Twitch chat. Don't forget to click first in chat input field to get points after a while.
// @description:de	Klickt automatisch die Bonus Punkte im Twitch chat. Nicht vergessen zuerst in die Chat-Eingabe einmal zu klicken (ihr bekommt daraufhin meistens eine Kanal-Chat-Regel angezeigt) um ggf. überhaupt Punkte zu erhalten.

// @downloadURL		https://localhost/userscripts/twitch/twitch-auto-claim-bonus.user.js
// @updateURL		https://localhost/userscripts/twitch/twitch-auto-claim-bonus.user.js

// @author		cnleo

// @namespace	cnleo/userscripts

// @grant none

// @match	https://www.twitch.tv/*
// @match	http://www.twitch.tv/*

// @match	https://twitch.tv/*
// @match	http://twitch.tv/*

// @version	1.3.1

// @run-at document-idle

// ==/UserScript==

console.log('twitch .user.js running');

// For different languages; This is the text given/specified from twitch, no own customization!
//const claim_text = ['Click to claim a bonus!','Klicken und Bonus abholen!'];
// claimable-bonus__icon tw-flex

// CONFIG OBSERVASION
const observerConfig = {
	attributes: false,
	childList: true,
	characterData: false,
	subtree: true, // performance is better with "subtree: false"; try to avoid it, but you lost many of observasion
	attributeOldValue: false,
	characterDataOldValue: false
	//attributeFilter: ['class']
}; // end config

// OBSERVASION ITSELF
/*
const observerFirst = new MutationObserver(function (mutations) {

	mutations.forEach(function (mutation) { // alternative for(let mutation of mutations) {
		
		for(var entry of mutation.addedNodes) {

			if (!!entry.classList) {
				
				let observerTarget = document.querySelector('div.community-points-summary');
				if (
					(!!entry.classList && entry.classList.contains('community-points-summary')) || (!!observerTarget && observerTarget !== null)
				) {

					
					
					
					let claim_bonus = entry.querySelector('button[class*="success" i]');
					if (!!claim_bonus && claim_bonus !== null) {
						console.log("ENTRY claim bonus click FIRST");
						claim_bonus.click();
					} else if (observerTarget.querySelector('button[class*="success" i]') !== null) {
						console.log("DOCUMENT claim bonus click FIRST");
						observerTarget.querySelector('button[class*="success" i]').click();
					}

					// TARGET OF OBSERVASION
					observerTarget = entry;

					// EXECUTE OBSERVASION
					observer.observe(observerTarget, observerConfig);

					// STOP OBSERVATION; NO NEED FOR OBSERVATION THE WHOLE DOM. FOR NOW WE HAVE THE ITEM WE NEED ONLY TO CHECK IN FUTURE 
					
					observerFirst.disconnect();

					console.log('SToP ObSeRVaTiOn First');

				}			
			}
		} // for

	}); // mutations.forEach(function (mutation) { 
}); // new MutationObserver(function (mutations) {
*/

// OBSERVASION ITSELF
const observer = new MutationObserver(function (mutations) {

	mutations.forEach(function (mutation) { // alternative for(let mutation of mutations) {
		
		for(var entry of mutation.addedNodes) {

			if (!!entry.classList) {
				// console.log('classes:',entry.classList.toString());

				// document.querySelector('div[class*="success" i]');
				let claim_bonus_entry = entry.querySelector('button[class*="success" i]');
				//let claim_bonus_dom = document.querySelector('button[class*="success" i]');
				
				if (!!claim_bonus_entry && claim_bonus_entry !== null) {
					claim_bonus_entry.click();
					console.log('ENTRY bonus clicked'); 
				} /* else if (!!claim_bonus_dom && claim_bonus_dom !== null) {
					console.log('DOM bonus clicked');
					claim_bonus_dom.click();
				}*/

				else {
					console.log('no claim')
				}
				
			}
			
		} // for

	}); // mutations.forEach(function (mutation) { 
}); // new MutationObserver(function (mutations) {

// SOME ELEMENTAR VARS 
let observerObserved = 'false'; // false and true as string
let intervalID = null;
// DONE

// FUNC TO PRETEND REPEAT YOURSELF
function funcInterval(_setString){
	if (!intervalID) {
		intervalID = setInterval(observeThings, 222);
		console.log(_setString);
	}
}

// PRETEND LOST OBSERVATION BY REMOVE ELEMENT/PARENT NODE E.G. ON RAIDS TO A OTHER SITE
/*
	createElemetn('span');
	set absolute position left -99999px;
	el.addEventListener('DOMNodeRemoved', feedback, false);
	append to body
	remove
	check was feedback ever will do now or not
*/
// replacement for the Deprecated DOMnodeRemoved() AND will not work as aspected because it will not fire if the parent or grand parents are removed
function onRemove(el, callback) {
	new MutationObserver((mutations, observer) => {
		if(!document.body.contains(el)) { // maybe it must be something of document.html if the whole body replaced
			observer.disconnect();
			funcInterval('set intv onRemove');
			//callback();
		}
	}).observe(document.body, { childList: true });
}
// PRETEND LOST OBSER... DONE

function observeThings(){
	console.log('func obsThi BEG');

	// TARGET OF OBSERVASION in SPE
	let observerTargetGoal = document.querySelector('div.community-points-summary');
	if (!!observerTargetGoal && observerTargetGoal !== null) {
		clearInterval(intervalID);
		intervalID = null;
		console.log('interv cleared');
		// if there is already bonus to claim, we must click, otherwise it will never be triggerd by observer
		
		// let claim_bonus_dom = observerTargetGoal.querySelector('button[class*="success" i]');
		// https://developer.mozilla.org/en-US/docs/Web/CSS/:scope
		// let claim_bonus_dom = observerTargetGoal.querySelector(':scope button[class*="success" i]');
		let claim_bonus_dom = document.querySelector('button[class*="success" i]');
		if (!!claim_bonus_dom && claim_bonus_dom !== null) {
			claim_bonus_dom.click();
			console.log('DOM CHANNEL bonus clicked');
		}
	
		// EXECUTE OBSERVASION
		observer.observe(observerTargetGoal, observerConfig);
		observerObserved = 'true';
		console.log('on observe');

		onRemove(observerTargetGoal);
		console.log('onRemove set');

	} else {
		if(observerObserved === 'true'){
			observer.disconnect();
			observerObserved = 'false';
			console.log('already observed and now disconnect')
		}
		console.log('no observe');

		// if no observer re check after 30 sec up to 5 min or something
	}


	console.log('func obsThi END');
}

window.addEventListener('load', () => {
	console.log('page is fully loaded');
	//observeThings();
	funcInterval('set intv');
});

// We lost the observer on raids, because of lost the "original" (dynamic content changes) observed element
window.addEventListener('popstate', () => { // maybe "popstate" has some diffrent behaviours on chromium and mozilla based browser
	console.log('page is there history changing');
	//observeThings();
	funcInterval('set intv popstate');
});
/*
window.onpopstate = (event) => {
	alert(`location: ${document.location}, state: ${JSON.stringify(event.state)}`)
}
*/
console.log('twitch .user.js running as well to this point so far');
