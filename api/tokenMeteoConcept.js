//Fonction serverless
export default async (req, res) => {

  //On récupère les datas passées dans le script client par la query
  const { latitude, longitude} = req.query;
  console.log(latitude, longitude)
  
  // const apiToken = process.env.METEO_API_TOKEN; // Utilise la variable d'environnement pour le token
  
  const urlGetDays = `https://api.meteo-concept.com/api/forecast/daily?token=29afc1df92b940bb0a443d33e644f026da4af771eeae29f7485195348c6c3fcb&latlng=${latitude},${longitude}`;
  const urlGetHours = `https://api.meteo-concept.com/api/forecast/nextHours?token=29afc1df92b940bb0a443d33e644f026da4af771eeae29f7485195348c6c3fcb&latlng=${latitude},${longitude}`;

  //${process.env.METEO_API_TOKEN}

  try {
    const [dataPerDayResponse, dataPerHourResponse] = await Promise.all([
      fetch(urlGetDays),
      fetch(urlGetHours),
    ]);

    if (!dataPerDayResponse.ok || !dataPerHourResponse.ok) {
      throw new Error('Erreur lors de la récupération des données météo');
    }

    const dataPerDay = await dataPerDayResponse.json();
    const dataPerHour = await dataPerHourResponse.json();

    res.status(200).json({ dataPerDay, dataPerHour });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};