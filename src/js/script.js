//API METEO CONCEPT
const weatherIcons = [
    {title:'soleil', img:'./src/images/soleil.png', map:[0]},
    {title:'eclarcies', img:'./src/images/eclaircies.png', map:[1]},
    {title:'nuageux', img:'./src/images/nuageux.png', map:[2,3]},
    {title:'très nuageux', img:'./src/images/nuageux-max.png', map:[4,5]},
    {title:'brouillard', img:'./src/images/brouillard.png', map:[6,7]},
    {title:'pluie faible', img:'./src/images/pluvieux.png', map:[10,11,13,16,40,210,211]},
    {title:'pluie forte', img:'./src/images/pluvieux-max.png', map:[10,11,12,14,15,41,42,43,44,45,46,47,48,212]},
    {title:'neige', img:'./src/images/neigeux.png', map:[20,21,22,30,31,32,60,61,62,63,64,65,66,67,68,70,71,72,73,74,75,76,77,78,220,221,222,230,231,232,235]},
    {title:'orages', img:'./src/images/orage.png', map:[100,101,102,103,104,105,106,107,108,120,121,122,123,124,125,126,127,128,130,131,132,133,134,135,136,137,138,140,141]},
]

initMeteoApp(); //Init l'API météo
initTodayDate(); //Afficher la date du jour
initAutocomplete(); //Init l'API Google Places

//--- AFFICHAGE DES DONNEES METEO ---
async function initMeteoApp(latitude = '48.7991' , longitude = '2.4939') {

    try {
        //Appel à la fonction serverless
        handleLoader(true)
        const response = await fetch(`/api/tokenMeteoConcept?latitude=${latitude}&longitude=${longitude}`);
        if (!response.ok) {
        throw new Error('Probleme détecté')
    }
    const { dataPerDay, dataPerHour } = await response.json();
    console.log('new method ok');
    
    //Afficher les données
    displayData(dataPerDay, dataPerHour);
    
    } catch (error) {
        console.error(error);
    } finally {
        handleLoader(false)
    }
    
}

function displayData(dataPerDay, dataPerHour) {
    let weatherCode = 0;
    let icon = '';

    //*METEO CONCEPT
    //*Today
    const meteoConceptTodayIcon = document.querySelector('.today__widget .weather-icon');
    const meteoConceptTodayTempMax = document.querySelector('.today__widget > .temperature .temp-max-value');
    const meteoConceptTodayTempMin = document.querySelector('.today__widget > .temperature .temp-min-value');
    const meteoConceptTodayWind = document.querySelector('.today__widget > .wind .wind-value');
    const meteoConceptTodayProbaRain = document.querySelector('.today__widget > .rain .proba-rain-value');
    const meteoConceptTodayQuantityRain = document.querySelector('.today__widget > .rain .qte-rain-value');

    weatherCode = Number(dataPerDay.forecast[0].weather);
    weatherIcons.forEach(el => {
        if (el.map.includes(weatherCode)) {
            return icon = el.img
        }   
        if (icon === '') {
            icon = './src/images/nuageux.png'
        }
        return icon
    })

    meteoConceptTodayIcon.src = icon;
    meteoConceptTodayTempMax.innerText = dataPerDay.forecast[0].tmax + ' °';
    meteoConceptTodayTempMin.innerText = dataPerDay.forecast[0].tmin + ' °';
    meteoConceptTodayWind.innerText = dataPerDay.forecast[0].wind10m;
    meteoConceptTodayProbaRain.innerText = dataPerDay.forecast[0].probarain;
    meteoConceptTodayQuantityRain.innerText = dataPerDay.forecast[0].rr10;

    //*Rain in hour
    const probaRainHour = document.querySelector('.rain__widget .proba-rain-hour-value');
    const quantityRainHour = document.querySelector('.rain__widget .qte-rain-hour-value');
    probaRainHour.innerText = dataPerHour.forecast[0].probarain;
    quantityRainHour.innerText = dataPerHour.forecast[0].rr1;

    //*This week
    const articleWeekElement = document.querySelector('.week__list');
    articleWeekElement.innerHTML = ''; //Clean la div

    const ulWeekElement = document.createElement('ul');
    ulWeekElement.className = 'week__widget';

    let liElementsDays = '';

    const today = new Date();

    for (let i = 0; i < 7; i++) {
        //Déterminer la date
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);

        const day = String(futureDate.getDate()).padStart(2, '0');
        const month = String(futureDate.getMonth() + 1).padStart(2, '0');
        const formattedDate = `${day}/${month}`; // Format JJ/MM

        //Déterminer l'icone
        weatherCode = Number(dataPerDay.forecast[i].weather);
        weatherIcons.forEach(el => {
            if (el.map.includes(weatherCode)) {
                return icon = el.img
            }   
            if (icon === '') {
                icon = './src/images/nuageux.png'
            }
            return icon
        })

        liElementsDays += `
            <li class="week__widget__day">
                <div class="item date">
                    <p class="font-widget"> <time>${formattedDate}</time> </p>
                </div>
                <div class="item weather">
                    <img class="weather-icon" src="${icon}" alt="sun">
                </div>
                <div class="item temperature">
                    <p class="font-widget"> <span class="temp-max-value">${dataPerDay.forecast[i].tmax}°</span> /  <span class="temp-min-value">${dataPerDay.forecast[i].tmin}°</span> </p>
                </div>
                <div class="item wind">
                    <p class="font-widget"> ${dataPerDay.forecast[i].wind10m}km/h </p>
                </div>
                <div class="item rain">
                    <p class="font-widget"> ${dataPerDay.forecast[i].probarain}% </p>
                    <p class="font-widget"> ${dataPerDay.forecast[i].rr10}mm </p>
                </div>
            </li>
        `
    }

    ulWeekElement.innerHTML = liElementsDays;
    articleWeekElement.appendChild(ulWeekElement);
}

//--- GESTION DE LA LOCALISATION AVEC GOOGLE PLACES
function initAutocomplete() {
    let input = document.getElementById('autocomplete');
    let options = {
        componentRestrictions:{
            country:'fr'
        }
    }
    
    //Configurer l'autocomplete Places
    let autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', async function() {

        let place = autocomplete.getPlace();
        if (!place.geometry) { //Si pas de suggestion par l'utilisateur
            return
        }

        //Récupérer et afficher les infos de la loc
        let cityName = place.name;
        let latitude = place.geometry.location.lat();
        let longitude = place.geometry.location.lng();
        document.querySelector('#location > h1').textContent = cityName;

        await initMeteoApp(latitude, longitude);
    })
}

//--- DETERMINER ET AFFICHER LA DATE DU JOUR
function initTodayDate() {
    const today = new Date();

    // Tableau des noms des jours et des mois
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

    // Extraire les informations de la date
    const dayName = days[today.getDay()];
    const dayOfMonth = today.getDate();
    const monthName = months[today.getMonth()];

    const formattedDate = `${dayName} ${dayOfMonth} ${monthName}`;
    
    const headerDate = document.querySelector('.today__header > time');
    headerDate.textContent = formattedDate;
}


function handleLoader(show) {
    document.getElementById("loader-container").style.display = show ? 'flex' : 'none';
    document.getElementById("main").style.display = show ? 'none' : 'block';
}
