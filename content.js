const urlPlanner = /starrailstation.com\/(.*)\/planner/;
const urlMaterials = /starrailstation.com\/(.*)\/materials/;

const linkDictionary = {};

console.log(linkDictionary);
let siteLink;
let checked = false;

fetch('https://raw.githubusercontent.com/MunloockButReal/StarRailStationPlannerResinCounter/main/siteLink')
	.then((resp) => resp.text())
	.then((data) => {
		siteLink = data;
		console.log(siteLink);
		fetchDictionary();
	});

const fetchDictionary = () => {
	if (siteLink && !checked) {
		fetch(siteLink)
			.then((resp) => resp.json())
			.then((data) => {
				const purposeIDs = {
					1: 'CharacterExp',
					2: 'BossMaterial',
					3: 'PathMaterial',
					4: 'WeeklyBossMaterial',
					5: 'WeaponExp',
					11: 'Credits',
				};

				const rarityNames = {
					2: 'Green',
					3: 'Blue',
					4: 'Violet',
				};
				const ignoreList = ['Tracks of Destiny', 'Tears of Dreams', 'Enigmatic Ectostella'];
				const obj = data.itemReferences;

				for (const key in obj) {
					if (Object.hasOwnProperty.call(obj, key)) {
						item = obj[key];
						const itemPurposeId = purposeIDs[item.purposeId];

						if (itemPurposeId == undefined || ignoreList.includes[item.name]) continue;

						const string = item.name === 'Credit' ? item.name : itemPurposeId === 'BossMaterial' || itemPurposeId === 'WeeklyBossMaterial' ? `${itemPurposeId} | ${item.name}` : `${itemPurposeId} | ${item.name} | ${rarityNames[item.rarity]}`;

						linkDictionary[item.iconPath] = string;
					}
				}

				checked = true;
			});
	}
};

let prevUrl = undefined;

setInterval(() => {
	if (Object.keys(linkDictionary).length > 0) {
		const currUrl = window.location.href;
		if (currUrl != prevUrl) {
			prevUrl = currUrl;
			if (currUrl.match(urlPlanner)) {
				waitForLoadingAndExecute();
			}
			if (currUrl.match(urlMaterials)) {
				waitForLoadingAndExecuteUpdatingMaterials();
			}
		}
	}
}, 100);

document.addEventListener('fetch', (e) => {
	console.log('Fetch ');
	console.log(e);
});
function waitForLoadingAndExecute() {
	const interval = setInterval(() => {
		if (document.body.innerText.includes('Loading')) {
			console.log('Site is loading. Waiting to fully load planner...');
		} else {
			clearInterval(interval);
			console.log('Planner is loaded!');
			targetElement = document.querySelector('.abb99.adba2');
			myObserver = startObserving();
			calculateTotal();
		}
	}, 100);
}
/*						This is code for grabbing material page based on your language
							Also might use document.all[0].lang instead of grabbing lang from url
								Update: Doesn't work, e.g: jp/ja

			fetch(`https://starrailstation.com/${window.location.href.match(/starrailstation.com\/(.*)\/planner/)[1]}/materials`)
				.then((response) => response.text())
				.then((data) => console.log(data));

*/

function waitForLoadingAndExecuteUpdatingMaterials() {
	setTimeout(() => {
		console.log(window);
	}, 1000); // Adjust the delay as needed

	const interval = setInterval(() => {
		if (window.PAGE_CONFIG === undefined) {
			// console.log('window.PAGE_CONFIG == undefined');
		} else {
			clearInterval(interval);
			console.log('Work is done');
			let a = window.PAGE_CONFIG.entries || {};
			let parsedObject = {};
			for (let i = 1; i <= 5; i++) {
				let b = a.filter((e) => e.purposeId == i);

				b.forEach((e) => {
					const iconPath = e.iconPath;
					const rarityName = e.rarity === 4 ? 'Violet' : e.rarity === 3 ? 'Blue' : e.rarity === 2 ? 'Green' : 0;
					const itemName = e.name;
					switch (i) {
						case 1:
							//Character EXP
							parsedObject[iconPath] = `CharacterExp | ${rarityName}`;
							break;

						case 2:
							// Boss Materials
							if (itemName !== 'Enigmatic Ectostella') {
								parsedObject[iconPath] = `BossMaterial | ${itemName}`;
							}
							break;
						case 3:
							let path;

							if (itemName === 'Tears of Dreams') break;

							switch (itemName) {
								// Destruction
								case 'Worldbreaker Blade':
								case 'Lifeless Blade':
								case 'Shattered Blade':
								case 'Moon Madness Fang':
								case 'Lupitoxin Sawteeth':
								case 'Borisin Teeth':
									path = 'Destruction';
									break;

								// Hunt
								case 'Arrow of the Starchaser':
								case 'Arrow of the Demon Slayer':
								case 'Arrow of the Beast Hunter':
									path = 'Hunt';
									break;
								case 'Key of Wisdom':
								case 'Key of Knowledge':
								case 'Key of Inspiration':
									path = 'Erudition';
									break;

								// Preservation
								case 'Safeguard of Amber':
								case 'Oath of Steel':
								case 'Endurance of Bronze':
								case 'Divine Amber':
								case 'Crystal Meteorites':
								case 'Scattered Stardust':
									path = 'Preservation';
									break;

								// Nihility
								case 'Obsidian of Obsession':
								case 'Obsidian of Desolation':
								case 'Obsidian of Dread':
								case 'Heaven Incinerator':
								case 'Starfire Essence':
								case 'Fiery Spirit':
									path = 'Nihility';
									break;

								// Harmony
								case 'Stellaris Symphony':
								case 'Ancestral Hymn':
								case 'Harmonic Tune':
								case 'Heavenly Melody':
								case 'Celestial Section':
								case 'Firmament Note':
									path = 'Harmony';
									break;

								// Abundance
								case 'Flower of Eternity':
								case 'Sprout of Life':
								case 'Seed of Abundance':
								case 'Myriad Fruit':
								case 'Nourishing Honey':
								case 'Alien Tree Seed':
									path = 'Abundance';
									break;
								default:
									break;
							}

							if (path === undefined) console.log(itemName);

							parsedObject[iconPath] = `PathMaterial | ${path} | ${rarityName}`; // Add Path
							break;
						case 4:
							// Weekly Boss

							if (e.rarity === 4) {
								parsedObject[iconPath] = `WeeklyBossMaterial | ${itemName}`;
							}
							break;
						case 5:
							// WeaponEXP
							parsedObject[iconPath] = `WeaponExp | ${rarityName}`;
							break;
						default:
							break;
					}
				});
				console.log(b);
			}
			console.log(parsedObject);
		}
	}, 100);
}

function calculateTotal() {
	stopObserving(myObserver);

	let containers = document.querySelectorAll('.calculator-route-main-content-wrapper.page-margins-top .abb99.adba2 .a7721.aa7bf.a0c59.a4294');

	containers = Array.from(containers).filter((element) => element.style.opacity != 0.4);

	const elementToRemove = document.querySelectorAll('.resinDiv');

	if (elementToRemove) {
		elementToRemove.forEach((element) => {
			element.parentNode.removeChild(element);
		});
	}

	const totalResinDiv = document.querySelector('.a0c59 .a4041.ae764');
	totalResinDiv.style.alignItems = 'center';
	let totalResin = 0;

	containers.forEach((container) => {
		let materials = /Material|消費素材|需要刷的行迹|소모 재료|Materiais|Материалы|Nguyên Liệu Tiêu Hao|วัสดุที่ต้องใช้|Matériaux requis|Benötigte Materialien/;

		let name = container.querySelector('.a50cf').innerText.replace(/.*\n/, '');

		if (container.innerText.match(materials)) {
			let resinCredits = 0;
			let characterExp = 0;
			let resinCharacterExp = 0;
			let weaponExp = 0;
			let resinWeaponExp = 0;
			let resinBossMaterial = 0;

			let pathMaterialGreen = 0;
			let pathMaterialBlue = 0;
			let pathMaterialViolet = 0;
			let resinPathMaterial = 0;
			let resinWeeklyBossMaterial = 0;

			let elements = container.querySelectorAll('.a4041.ac458.ae051:not(:has(img.a2647))');

			let parent = container.querySelector('.a4041.ac458.ae051').parentElement.parentElement.querySelector('.a4041');
			parent.style.display = 'flex';
			parent.style.justifyContent = 'space-between';
			parent.style.alignItems = 'center';
			elements.forEach((element) => {
				let imgSrc = element
					.querySelector('img')
					.getAttribute('src')
					.replace(/.*\/assets\/|\.webp/g, ''); // Remove \d

				if (linkDictionary.hasOwnProperty(imgSrc)) {
					let materialType = linkDictionary[imgSrc];
					let value = parseInt(element.querySelector('.ab279').textContent.replace(/ | |,|\./g, ''));

					let craftable = element.querySelector('.a6eb1');

					if (craftable) {
						value = Number(String(value).slice(0, -craftable.textContent.length));
					}

					if (materialType === 'Credit') {
						resinCredits += Math.ceil(value / 24000) * 10;
					} else if (materialType.startsWith('CharacterExp')) {
						if (materialType.includes('Violet') || materialType.includes('Adventure Log')) {
							characterExp += value * 20000;
						} else if (materialType.includes('Blue') || materialType.includes("Traveler's Guide")) {
							characterExp += value * 5000;
						} else if (materialType.includes('Green') || materialType.includes('Travel Encounters')) {
							characterExp += value * 1000;
						}
					} else if (materialType.startsWith('WeaponExp')) {
						if (materialType.includes('Violet')) {
							weaponExp += value * 6000;
						} else if (materialType.includes('Blue')) {
							weaponExp += value * 2000;
						} else if (materialType.includes('Green')) {
							weaponExp += value * 500;
						}
					} else if (materialType.startsWith('BossMaterial')) {
						resinBossMaterial += Math.ceil(value / 5) * 30;
					} else if (materialType.startsWith('WeeklyBossMaterial')) {
						resinWeeklyBossMaterial += Math.ceil(value / 3) * 30;
					} else if (materialType.startsWith('PathMaterial')) {
						if (materialType.includes('Green')) {
							pathMaterialGreen = value;
						} else if (materialType.includes('Blue')) {
							pathMaterialBlue = value;
						} else if (materialType.includes('Violet')) {
							pathMaterialViolet = value;
						}
					}
				}
			});

			resinPathMaterial = pathSimulation(pathMaterialGreen, pathMaterialBlue, pathMaterialViolet);
			resinCharacterExp = Math.ceil(characterExp / 45000) * 10;
			resinWeaponExp = Math.ceil(weaponExp / 11250) * 10;
			let resin = resinCredits + resinCharacterExp + resinWeaponExp + resinBossMaterial + resinPathMaterial + resinWeeklyBossMaterial;

			totalResin += resin;
			let resinDiv = document.createElement('div');
			resinDiv.style.border = '1px solid currentColor';
			resinDiv.style.borderRadius = '5px';
			resinDiv.style.display = 'flex';
			resinDiv.style.margin = '5px 0';
			resinDiv.style.alignItems = 'center';
			resinDiv.style.flexWrap = 'wrap';
			resinDiv.classList.add('resinDiv');

			resinDiv.innerHTML = `
    		<img src="https://cdn.starrailstation.com/assets/98ad38bd28a1d59def9f7aef71277ade135a491f23d5cf8ffd522a66611bd803.webp" height="32px" style="align-self: center; padding: 0;">
    		<div style="margin: 0 5px; text-align: center; color: white; font-size: 1.266rem;">
			${resin} | ~${Number((resin / 240).toFixed(1))} Days</div>`;

			let obj = {};

			obj[`Name`] = name;
			obj[`Resin for Credits`] = resinCredits;
			obj[`Resin for CharacterExp`] = resinCharacterExp;
			obj[`Resin for WeaponExp`] = resinWeaponExp;
			obj[`Resin for BossMaterial`] = resinBossMaterial;
			obj[`Resin for PathMaterial`] = resinPathMaterial;
			obj[`Resin for WeeklyBossMaterial`] = resinWeeklyBossMaterial;
			obj[`Resin`] = resin;

			console.log(obj);

			let moreStats = () => {
				let string = '';

				let maxLengthText = 0;
				let maxLengthResin = 0;
				['Resin for Credits', 'Resin for CharacterExp', 'Resin for WeaponExp', 'Resin for BossMaterial', 'Resin for PathMaterial', 'Resin for WeeklyBossMaterial'].forEach((e) => {
					let item = e.split(' ')[2];

					if (item.length > maxLengthText && obj[e] !== 0) maxLengthText = item.length;
					if (String(obj[e]).length > maxLengthResin) maxLengthResin = String(obj[e]).length;
				});

				['Resin for Credits', 'Resin for CharacterExp', 'Resin for WeaponExp', 'Resin for BossMaterial', 'Resin for PathMaterial', 'Resin for WeeklyBossMaterial'].forEach((e) => {
					let item = e.split(' ')[2];

					// console.log(obj[e]);
					if (obj[e] !== 0) {
						string += `<div style="display: flex"><img src="https://cdn.starrailstation.com/assets/98ad38bd28a1d59def9f7aef71277ade135a491f23d5cf8ffd522a66611bd803.webp" height="24px" style="align-self: center; padding: 0;">
						<div style="margin: 0 5px; text-align: center; color: white; font-size: ${maxLengthText > 10 ? 'small' : 'smaller'}; align-self: center;">
						<pre style="margin: 3px 5px">${item.padStart(maxLengthText, ' ')} | ${String(obj[e]).padStart(maxLengthResin, ' ')} | ~${Number((obj[e] / 240).toFixed(1))} Days</pre></div></div>`;
					}
				});

				// console.log(string);
				return string;
			};

			let switched = true;
			const original = resinDiv.innerHTML;
			const moreInfo = moreStats();
			resinDiv.addEventListener('click', () => {
				stopObserving(myObserver);
				if (switched) {
					resinDiv.innerHTML = moreInfo;
					resinDiv.style.flexDirection = 'column';
					resinDiv.style.alignItems = 'normal';
				} else {
					resinDiv.innerHTML = original;
					resinDiv.style.flexDirection = 'row';
				}

				switched = !switched;
				myObserver = startObserving();
			});

			parent.appendChild(resinDiv);
		}
	});

	let resinDiv = document.createElement('div');
	resinDiv.style.border = '1px solid currentColor';
	resinDiv.style.borderRadius = '5px';
	resinDiv.style.display = 'flex';
	resinDiv.style.margin = '5px 0';
	resinDiv.style.alignItems = 'center';
	resinDiv.classList.add('resinDiv');

	resinDiv.innerHTML = `
		<img src="https://cdn.starrailstation.com/assets/98ad38bd28a1d59def9f7aef71277ade135a491f23d5cf8ffd522a66611bd803.webp" height="32px" style="align-self: center; padding: 0;">
	<div style="margin: 0 5px; text-align: center; color: white; font-size: 1.266rem;">
	${totalResin} | ~${Number((totalResin / 240).toFixed(1))} Days</div>`;

	let ele1toggled = false;
	resinDiv.addEventListener('click', () => {
		ele1toggled = !ele1toggled;
		if (ele1toggled) {
			const ele1 = document.createElement('div');
			ele1.classList.add('ele1');
			ele1.style.display = 'flex';
			ele1.style.flexWrap = 'wrap';
			ele1.style.justifyContent = 'flex-start';
			ele1.style.padding = '20px 0 0 0';

			const imagesLinks = Object.keys(linkDictionary);
			const imagesName = Object.values(linkDictionary);
			imagesLinks.forEach((ee, index) => {
				const ele = document.createElement('div');
				ele.innerHTML = `<img src="https://cdn.starrailstation.com/assets/${ee}.webp" alt="${imagesName[index]}"  height="32px">`;
				ele1.appendChild(ele);
			});
			resinDiv.parentElement.parentElement.appendChild(ele1);
		} else {
			let ele1l = document.querySelector('.ele1');
			ele1l.remove();
		}
	});
	totalResinDiv.appendChild(resinDiv);

	myObserver = startObserving();
}

function pathSimulation(g, b, v) {
	let pathMaterialViolet = 0;
	let pathMaterialBlue = 0;
	let pathMaterialGreen = 0;

	let pathMaterialRuns = 0;
	while (pathMaterialViolet < v || pathMaterialBlue < b || pathMaterialGreen < g) {
		pathMaterialViolet += 0.157;
		pathMaterialBlue += 1;
		pathMaterialGreen += 1.25;

		if (pathMaterialGreen > g) {
			pathMaterialBlue += Math.floor((pathMaterialGreen - g) / 3);
			pathMaterialGreen -= Math.floor((pathMaterialGreen - g) / 3) * 3;
		}
		if (pathMaterialBlue > b) {
			pathMaterialViolet += Math.floor((pathMaterialBlue - b) / 3);
			pathMaterialBlue -= Math.floor((pathMaterialBlue - b) / 3) * 3;
		}

		pathMaterialRuns++;
	}
	return pathMaterialRuns * 10;
}
let targetElement;

const observerConfig = {
	childList: true,
	characterData: true,
	subtree: true,
};

const mutationCallback = function (mutationsList, observer) {
	for (const mutation of mutationsList) {
		console.log(mutationsList);
		if (mutation.type === 'childList' || mutation.type == 'characterData') {
			calculateTotal();
			break;
		}
	}
};

function startObserving() {
	const observer = new MutationObserver(mutationCallback);
	observer.observe(targetElement, observerConfig);
	return observer;
}

function stopObserving(observer) {
	if (observer) {
		observer.disconnect();
	}
}

let myObserver;
