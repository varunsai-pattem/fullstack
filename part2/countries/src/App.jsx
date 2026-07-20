import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryDetail from './components/CountryDetail'

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  // Fetch all countries on load
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        console.error('Failed to fetch country records:', error)
      })
  }, [])

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
    setSelectedCountry(null)
  }

  // Filter countries matching the query
  const matchedCountries =
    query === ''
      ? []
      : countries.filter(country =>
          country.name.common
            .toLowerCase()
            .includes(query.toLowerCase())
        )

  // Determine what to display
  const renderContent = () => {
    if (selectedCountry) {
      return <CountryDetail country={selectedCountry} />
    }

    if (matchedCountries.length > 10) {
      return <p>Too many matches, specify another filter</p>
    }

    if (matchedCountries.length > 1) {
      return (
        <div>
          {matchedCountries.map(country => (
            <p key={country.cca3}>
              {country.name.common}{' '}
              <button onClick={() => setSelectedCountry(country)}>
                show
              </button>
            </p>
          ))}
        </div>
      )
    }

    if (matchedCountries.length === 1) {
      return <CountryDetail country={matchedCountries[0]} />
    }

    return null
  }

  return (
    <div>
      <div>
        find countries{' '}
        <input
          value={query}
          onChange={handleQueryChange}
        />
      </div>

      {renderContent()}
    </div>
  )
}

export default App