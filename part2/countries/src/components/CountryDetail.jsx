import Weather from './Weather'

const CountryDetail = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>

      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <div style={{ fontSize: '150px', margin: '10px 0' }}>
        {country.flag}
      </div>
      <Weather city={country.capital} />
    </div>
  )
}

export default CountryDetail