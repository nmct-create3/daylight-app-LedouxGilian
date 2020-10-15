// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

const _convertTime = (t) => {
	const time = new Date('0001-01-01 ' + t);
	const formatted = time.getHours() + ':' + ('0' + time.getMinutes()).slice(-2);
	return formatted;
};

const _parseMilliseconds = (timestamp) => {
	const time = new Date(timestamp * 1000);

	const hours = time.getHours();
	const minutes = time.getMinutes();

	return `${hours.toString().padStart('0',2)}:${minutes.toString().padStart('0',2)}`;
}

// 5 TODO: maak updateSun functie
const updateSun = (sunElement, left, bottom, now) => {
	sun.style.left = `${left}%`;
	sun.style.bottom = `${bottom}%`;

	const currentTimeStamp = `${now.getHours().toString().padStart(2)}`
	sun.setAttribute('data-time', currentTimeStamp);
}

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	const sun = document.querySelector('.js-sun'),
		minutesLeft = document.querySelector('.js-time-left');

	// Bepaal het aantal minuten dat de zon al op is.
	const now = new Date(),
		sunriseData = new Date(sunrise * 1000);

	let minutesSunUp = (now.getHours() * 60 + now.getMinutes()) - (sunriseData.getHours() * 60 + sunriseData.getMinutes())

	const percentage = (100/totalMinutes) * minutesSunUp,
		sunLeft = percentage,
		sunBottom = percentage < 50 ? percentage * 2 : (100 - percentage) * 2;

		//korte if else
		// condition '?' = true ':' = false

	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	updateSun(sun, sunLeft, sunBottom, now);

	// We voegen ook de 'is-loaded' class toe aan de body-tag.


	// Vergeet niet om het resterende aantal minuten in te vullen.
	minutesLeft.innerText = totalMinutes - minutesSunUp

	// Nu maken we een functie die de zon elke minuut zal updaten
	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = (queryResponse) => {
	console.log({queryResponse})

	document.querySelector('.js-location').innerText = `${queryResponse.city.name}, ${queryResponse.city.country}`;
	document.querySelector('.js-sunrise').innerText = _parseMilliseconds(queryResponse.city.sunrise);
	document.querySelector('.js-sunset').innerText = _parseMilliseconds(queryResponse.city.sunset);

	const timeDifference = (queryResponse.city.sunset - queryResponse.city.sunrise) / 60;
	placeSunAndStartMoving(timeDifference, queryResponse.city.sunrise);
	// We gaan eerst een paar onderdelen opvullen
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = async (lat, lon) => {

	const data = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=nl&cnt=1`)
		.then((r) => r.json())
		.catch((err) => console.error('An error occured: ', err));

	console.log(data);
	showResult(data);

	// Eerst bouwen we onze url op
	// Met de fetch API proberen we de data op te halen.	
	// Als dat gelukt is, gaan we naar onze showResult functie.
};

document.addEventListener('DOMContentLoaded', function() {
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
});
