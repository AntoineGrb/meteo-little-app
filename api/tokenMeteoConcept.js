//Fonction serverless
export default async (req, res) => {

  //On récupère les datas passées dans le script client par la query
  const { latitude, longitude} = req.query;
  console.log(latitude, longitude)
  
  const urlGetDays = `https://api.meteo-concept.com/api/forecast/daily?token=${process.env.METEO_API_TOKEN}&latlng=${latitude},${longitude}`;
  const urlGetHours = `https://api.meteo-concept.com/api/forecast/nextHours?token=${process.env.METEO_API_TOKEN}&latlng=${latitude},${longitude}`;

  try {
    const [dataPerDayResponse, dataPerHourResponse] = await Promise.all([
      fetch(urlGetDays),
      fetch(urlGetHours),
    ]);

    if (!dataPerDayResponse.ok || !dataPerHourResponse.ok) {
      throw new Error('Erreur lors de la récupération des données météo');
    }

    console.log('Token env ok')

    const dataPerDay = await dataPerDayResponse.json();
    const dataPerHour = await dataPerHourResponse.json();

    res.status(200).json({ dataPerDay, dataPerHour });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};