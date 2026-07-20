import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ city }) => {
  const [weatherData, setWeatherData] = useState(null)

  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    if (!city) return

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`
      )
      .then(response => {
        setWeatherData(response.data)
      })
      .catch(error => {
        console.error('Failed to retrieve weather data:', error)
      })
  }, [city, api_key])

  if (!weatherData) {
    return <p>Loading weather data...</p>
  }

  return (
    <div>
      <h3>Weather in {city}</h3>

      <p>Temperature {weatherData.main.temp} Celsius</p>

      <img
        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
        alt={weatherData.weather[0].description}
      />

      <p>Wind {weatherData.wind.speed} m/s</p>
    </div>
  )
}

export default Weather