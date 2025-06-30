import { useEffect, useState } from "react";
import axios from "axios";

const Details = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const capital = country.capital?.[0];

  useEffect(() => {
    if (!capital || !country.capitalInfo?.latlng) return;

    const [lat, lon] = country.capitalInfo.latlng;
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    axios.get(apiUrl).then((response) => {
      setWeather(response.data.current_weather);
    });
  }, [capital, country]);

  return (
    <div style={{ marginTop: "1rem" }}>
      <h2>{country.name.common}</h2>
      <p>Capital: {capital}</p>
      <p>Population: {country.population}</p>

      <h3>Languages</h3>
      <ul>
        {country.languages &&
          Object.values(country.languages).map((lang) => (
            <li key={lang}>{lang}</li>
          ))}
      </ul>

      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width="250"
      />

      {weather ? (
        <>
          <h3>Weather in {capital}</h3>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Wind: {weather.windspeed} m/s</p>
        </>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
};

export default Details;
