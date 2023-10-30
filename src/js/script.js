//API METEO CONCEPT
const token = '29afc1df92b940bb0a443d33e644f026da4af771eeae29f7485195348c6c3fcb'
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

meteoApp();

async function meteoApp() {

    //APIs
    const urlMeteoConcept = `https://api.meteo-concept.com/api/forecast/daily?token=${token}&insee=94068`
    
    //Fetch les 3 APIs
    // [dataMeteoConcept, data2, data3] = await Promise.all([
    //     fetchData(urlMeteoConcept),
    //     fetchData(url2),
    //     fetchData(ur3),
    // ]);
    const dataMeteoConcept = await fetchData(urlMeteoConcept);
    const data2 = []
    const data3 = []

    //Afficher les données
    displayData(dataMeteoConcept, data2, data3);
    console.log(dataMeteoConcept);

    //Calculer la moyenne
    const dataAvg = calculateAverage(dataMeteoConcept, data2, data3);

    //Display la moyenne
    displayAverage(dataAvg)
}

async function fetchData(url) {
    const httpResponse = await fetch(url);
    const data = await httpResponse.json()
    console.log(data);
    return data
}

function displayData(data1, data2, data3) {

    let weatherCode = 0;
    let icon = '';

    //METEO CONCEPT
    const meteoConceptTodayIcon = document.querySelector('.today__sub-widget.meteo-concept .weather-icon');
    const meteoConceptTodayTemp = document.querySelector('.today__sub-widget.meteo-concept > .temperature .temp-value');
    const meteoConceptTodayWind = document.querySelector('.today__sub-widget.meteo-concept > .wind .wind-value');
    const meteoConceptTodayProbaRain = document.querySelector('.today__sub-widget.meteo-concept > .rain .proba-rain-value');
    const meteoConceptTodayQuantityRain = document.querySelector('.today__sub-widget.meteo-concept > .rain .qte-rain-value');

    weatherCode = Number(data1.forecast[0].weather);
    console.log(weatherCode);
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
    meteoConceptTodayTemp.innerText = data1.forecast[0].tmax;
    meteoConceptTodayWind.innerText = data1.forecast[0].wind10m
    meteoConceptTodayProbaRain.innerText = data1.forecast[0].probarain
    meteoConceptTodayQuantityRain.innerText = data1.forecast[0].rr10
}

function calculateAverage(data1, data2, data3) {
    const tempAvg = (data1.forecast[0].tmax);
    const windAvg = (data1.forecast[0].wind10m);
    const probaRainAvg = (data1.forecast[0].probarain);
    const quantityRainAvg = (data1.forecast[0].rr10);

    return { tempAvg, windAvg, probaRainAvg, quantityRainAvg }
}

function displayAverage(dataAvg) {
    console.log(dataAvg);
    const meteoAvgTodayIcon = document.querySelector('.today__widget .weather-icon');
    const meteoAvgTodayTemp = document.querySelector('.today__widget > .temperature .temp-value');
    const meteoAvgTodayWind = document.querySelector('.today__widget > .wind .wind-value');
    const meteoAvgTodayProbaRain = document.querySelector('.today__widget > .rain .proba-rain-value');
    const meteoAvgTodayQuantityRain = document.querySelector('.today__widget > .rain .qte-rain-value');

    meteoAvgTodayIcon.src = './src/images/soleil.png'; //! A mettre à jour
    meteoAvgTodayTemp.innerText = dataAvg.tempAvg
    meteoAvgTodayWind.innerText = dataAvg.windAvg
    meteoAvgTodayProbaRain.innerText = dataAvg.probaRainAvg
    meteoAvgTodayQuantityRain.innerText = dataAvg.quantityRainAvg
}
