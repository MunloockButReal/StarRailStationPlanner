const urlPlanner = /starrailstation.com\/(.*)\/planner/;
const urlMaterials = /starrailstation.com\/(.*)\/materials/;

let prevUrl = undefined;
setInterval(() => {
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
}, 100);

function waitForLoadingAndExecute() {
	const interval = setInterval(() => {
		if (document.body.innerText.includes('Loading')) {
			console.log('Site is loading. Waiting to fully load planner...');
		} else {
			clearInterval(interval);
			console.log('Planner is loaded!');

			targetElement = document.querySelector('.abb99.adba2');
			// targetElement = document.querySelector('.a0c59 .ab9c7.a267e');
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

					if (materialType === 'Credits') {
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

// const linkDictionary = fetch('dictionary.json')
// 	.then((resp) => resp.json())
// 	.then((data) => data);
// console.log(linkDictionary);

const linkDictionary = {
	// Basic
	'8fc9b77806662a775629ea8ec25d17374356ee5827146419aefefb4e5fa64a27': 'Credits',

	// Character EXP
	becaa9417d3a40db16e3d16da7b2864bd92c804f9b6062824c49aae61bb6b7a1: 'CharacterExp | Violet',
	'519019265755cdebba3968237a9ed2399097c89086d762698f9314ffc3180578': 'CharacterExp | Blue',
	'1895aeac789646d78ca7843ce780b8ac9baa5ccb50a135aafb1042a8fe0b0337': 'CharacterExp | Green',

	// Weapon Exp
	'1895aeac789646d78ca7843ce780b8ac9baa5ccb50a135aafb1042a8fe0b0337': 'WeaponExp | Violet',
	'42e7a259fea56f95597d32fc400f255d0b0f23e677981562484e970737564410': 'WeaponExp | Blue',
	'008db407e717c5e4703a0152c945bb21883550260a93ee6c7bb0fa9229346126': 'WeaponExp | Green',

	// Boss Materials
	'7e62afd36b2314862d8208b2b8eb130f8535f7edeafba247854fd020f67d9260': 'BossMaterial | Broken Teeth of Iron Wolf',
	'9623b51c49bcaf6f35eacb9eccd123f9612dc6c2c3b2d74598fa9ba5e8fc8234': 'BossMaterial | Endotherm Chitin',
	b3f581890a9e61a80537058d67ba17eb02ead3d7c3bda7e74e76071e51f62d42: 'BossMaterial | Horn of Snow',
	'089d05ee1d228dd64bf7b7418402e502caf8ad27aa2217432c8e8f6c98516d11': 'BossMaterial | Lightning Crown of the Past Shadow',
	e687fa1803bad282013a1a8c15b9cb8177b94c6d92e8a303065b5078d4a367f5: 'BossMaterial | Storm Eye',
	f589b65e09c63e81e71472776b47cb0078471f5ee34cda55db189190b5688c64: 'BossMaterial | Void Cast Iron',
	'3cc2affb44dd151c097d84ddde38ba3a682b7b9f312b03ac9339cf3c26f28c30': 'BossMaterial | Golden Crown of the Past Shadow',
	'33f818868d0d49966e7087b30885cc936f37032ae7987db99a2abfe8da26cdc3': 'BossMaterial | Netherworld Token',
	'8ad0f3d14c6c65787a08fe65cce8af73089b54e2cc33f19040ad09b31f72b09e': 'BossMaterial | Searing Steel Blade',
	f0206bc0518a6c6e69d89a68a7481696dd7399367e9f182a4097c7d87c507211: 'BossMaterial | Gelid Chitin',
	'74e56fa506cd872f5d0f198444fb8ca3c35666c7e9629800410a0a3b4b9463ec': "BossMaterial | Shape Shifter's Lightning Staff",
	'17c4281a58775f0d316035a01c93a944f5bb097ffb24955f620adcc19dc03169': 'BossMaterial | Ascendant Debris',
	'46e1e31cdf656dc3b29fe2132fce09e7c7eea405fb5e7ed70e448f8890c18ac4': 'BossMaterial | Nail of the Ape',
	c31905e6c5bec5a3962f29a1961f5813d9441b1aacd59d07be0accadf3184acc: 'BossMaterial | Suppressing Edict',
	'4e457e358310644ce3054344cad365762765bdab9d96076b3cf54c545406d598': 'BossMaterial | IPC Work Permit',
	'2f3600f83be422a695b07487ff158f1b9f6f35e146523f4d4d6f9c52534cd9a0': 'BossMaterial | Raging Heart',
	aa2728ab86d9f15ac65fc2dd22712a5938dcb22ae355fd741993785991f60c7d: 'BossMaterial | Dream Fridge',
	a137d1ce7ac8d1e9ba9d2f19e9bcb282cbf38d2141e4f77dcef42c14d69b95fd: 'BossMaterial | Dream Flamer',

	//		Path Materials 1.0 - 2.0

	//	-> 	Destruction
	da98edf78f23a9c80090c50d9633d6cdf6d43fb74d873ffa5f791126205599d4: 'PathMaterial | Destruction | Violet',
	'31324efb8271c657d2271c0c656cf3c265165e1b1de5ab0a1355397703472c11': 'PathMaterial | Destruction | Blue',
	c34484b3ccf3e5f1f4113e3c24d465e8d93dd5fcb95446241a8c08d6f65a0d27: 'PathMaterial | Destruction | Green',

	//	-> 	Hunt
	cf5a458a6f5b56925e970a2f6e10ac8fc3034f2b045e7d87e13c0a49e4c8fba8: 'PathMaterial | Hunt | Violet',
	cde54d9ea3870506cfb7367e25d2eada09bfe948b459125b5e916d55fa6d4133: 'PathMaterial | Hunt | Blue',
	'11a70d892dc3b897bc3d714367c18fe413d9538c809eb21c211f322eed806403': 'PathMaterial | Hunt | Green',

	//	-> 	Erudition
	f20dcddb7d5f53ca8e31f98f97f55ba2c8ebc935e110471bb9e1d913fa53025e: 'PathMaterial | Erudition | Violet',
	'26f9f701e21f71fb607d18470b7aee7ab70485eae418ec41e6b0ff10940c2f16': 'PathMaterial | Erudition | Blue',
	'0558df3e5e5ca8710ff54542568bf59d21e7ffd5fd542d4ce0b64236047cc80b': 'PathMaterial | Erudition | Green',

	//	-> 	Preservation
	e934381d41e660b5482c418d6baec5b21a7fda399a4ec04c65ed3a4d3cc349c8: 'PathMaterial | Preservation | Violet',
	'09271e659cfc1c6262e294dc0ddc436bf02f18b7a177a7fbd399d18d52dc8ce0': 'PathMaterial | Preservation | Blue',
	f20e94779b8463faaef55fff19c0b6228a23fac1cf2b800b5a01c133d76c1b1b: 'PathMaterial | Preservation | Green',

	//	-> 	Nihility
	a006d01f6dff4b81ed47879eec1b9c3513644d0677c4815bc3c8530882c4be21: 'PathMaterial | Nihility | Violet',
	eec42c153a07330e42c7c9d85fb5fd5e1dc72c10e1912f3f825bc4f853ae4bd1: 'PathMaterial | Nihility | Blue',
	'825865adfbcce2087595f3e3f5f83074ff634bac538fef3447ca92d001377dd8': 'PathMaterial | Nihility | Green',

	//	-> 	Harmony
	'007ad2366276ce70df0cda130c6cbd33e6a764cf9af6ff302656ff6a6937542f': 'PathMaterial | Harmony | Violet',
	'4cf16c3f1c7f10bd8fb063a7ee792484a4d9d3afcc77cd9eea7b975b6afe40e2': 'PathMaterial | Harmony | Blue',
	f20b2d461af5d8348103cc846e16f4426441cb47027f294a40f24130640f403f: 'PathMaterial | Harmony | Green',

	//	-> 	Abundance
	'969a6d57c217f2b43cb2d1be96d5fa06a30b8ca9834ec984f0649d019d666b13': 'PathMaterial | Abundance | Violet',
	e53b293c86a90843e4eac0cd4649e1b7f94b3aa93adec45d9fcadf0a4532d8af: 'PathMaterial | Abundance | Blue',
	'9c646329c4d4e9b8cb867e7864ce74f4ca6d18e611b748c516c1a5f3334d04b6': 'PathMaterial | Abundance | Green',

	//			Path Materials 2.0 - 3.0

	//	-> 	Destruction
	d71cc2db54ff50b5a43a8f6ff291ae634698f4e92e3bd83413019640adedbc67: 'PathMaterial | Destruction | Violet',
	e0e78c82a1d2b9bfdbe5892412ce0f0fce67e7c6b1336f9edc1c3c5009eb7ffa: 'PathMaterial | Destruction | Blue',
	'580522b463b9b6a2004a416da1470dfbc8b1233ae6661baa3613705fa8876f4b': 'PathMaterial | Destruction | Green',

	//	-> 	Hunt
	'115d108599f5562b60e29b8be50ccf23d27f4c8cec491fbedec36e4e52477927': 'PathMaterial | Hunt | Violet',
	'76a5e35d28e371eb95809e8975b54e6be3c6dfecd363669e615f5d50ade7824f': 'PathMaterial | Hunt | Blue',
	'1339acaf76f8117d50c0fe005ad137e4e1f8ed9b560b45ae8f5e497de7e014f6': 'PathMaterial | Hunt | Green',

	//	-> 	Erudition
	d60ab22f8dad23f043e324cd2670135934779691a0c96c9f775dbcfe268bb13f: 'PathMaterial | Erudition | Violet',
	be10d3ec93173e07682d057ec560f7f6fbc310a482e20fac8705eb43e1582f75: 'PathMaterial | Erudition | Blue',
	f1986c08bb827e84d5b714145bf68da49ec710682e80a3531b3e95e9a8cf3ccc: 'PathMaterial | Erudition | Green',

	//	-> 	Preservation
	'335d6c1a935e435e52517503ec667e1b6316b46969fb25164b9649162c6e7f78': 'PathMaterial | Preservation | Violet',
	aedbc01c5cf26b08598b686a22390eb2d70757a4a5f037306fc1b402c19fed65: 'PathMaterial | Preservation | Blue',
	'1cf37560e7110ae34ae2b93651a8e6f1bca80996f1323cca33bdf4137277d399': 'PathMaterial | Preservation | Green',

	//	-> 	Nihility
	d0d9f657c8aed8ea463ffb2a299173de7d94d7a4e67017343520f54275dd1e15: 'PathMaterial | Nihility | Violet',
	'7c6f5358c112aaee034dfcf277129fb03c3b23acdad032ea86bb8d940a9f9559': 'PathMaterial | Nihility | Blue',
	'7163c8b123f6a71726593ec29688538db75b232b3dfb0a50245eb8a6f4eb28c8': 'PathMaterial | Nihility | Green',

	//	-> 	Harmony
	'778df6f9b3a5c48680127dfa6bd63fcfebdac7e64ee2ca6e214ef1ceebf6fa76': 'PathMaterial | Harmony | Violet',
	e85f4354349d3ed12bf55533ca0f134f3066a134380a7d6b07cc2129f41edad0: 'PathMaterial | Harmony | Blue',
	fc04cb34a709ee9feb6e3664e524dc88ae28e382d7ce1b9fe5cd6943fcbf8d03: 'PathMaterial | Harmony | Green',

	//	-> 	Abundance
	da3b74a5d9ab68a941a193dd5790b40d753ade2715ded52f49b83fdff3c00924: 'PathMaterial | Abundance | Violet',
	e34be5197b27ac4e4a19cdf97ac35771105513b2155996ce7c0a0359d1864c41: 'PathMaterial | Abundance | Blue',
	bd4573a363ee88ed33d57eefa26a8317a49d6d3df94d9e50171e293514014ed8: 'PathMaterial | Abundance | Green',

	// Weekly Bosses
	'04088e0733990d7a0c884c42641a26089c8376f465104345af368511bbcedbac': "WeeklyBossMaterial | Destroyer's Final Road",
	'84cb3b4bee024a0e2c43101da44394dee59e313da5b959c85ca1e9d140e31eaf': "WeeklyBossMaterial | Guardian's Lament",
	cf2788ec5bdb2c1137c8bdf583b557edd00667b1f629205eccb2a92e506b62a8: 'WeeklyBossMaterial | Regret of Infinite Ochema',
	'021510fda34098d12f31549a6dfc2257a20b8c51087684e3585392122b8a07ca': 'WeeklyBossMaterial | Past Evils of the Borehole Planet Disaster',
	fd3a5e6b318a5a9f8dabd54c0767a6eaedee125a264fe171d2d602e5449355a0: 'WeeklyBossMaterial | Lost Echo of the Shared Wish',
};
