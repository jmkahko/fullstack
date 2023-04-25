import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [findCountry, setFindCountry] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get(`https://restcountries.com/v3.1/all`)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const countriesShow = countries.filter(c => c.name.common.toUpperCase().includes(findCountry.toUpperCase()))

  const Filter = ({ value, onChange }) => {
    return (
      <p>find countries <input value={value} onChange={onChange} /></p> 
    )
  }

  const Country = (country) => {
    const languageList = []
    for (const [key, value] of Object.entries(country.value[0].languages)) {
      languageList.push(value)
    }

    return (
      <div>
        <h2>{country.value[0].name.common}</h2>
        <p>capital {country.value[0].capital[0]}</p>
        <p>area {country.value[0].area}</p>

        <h3>languages:</h3>
        <ul>
          {languageList.map(l => 
            <li>{l}</li>
          )}
        </ul>
        <img src={country.value[0].flags.png} />
      </div>
    )
  }

  const Countries = (countries) => {
    return (
      <div>
        <p>{countries.c.common}</p>
      </div>
    )
  }

  const CountriesList = ({ countries }) => {
    if (countries.length > 10) {
      return (
        <p>Too many matches, specify another filter</p>
      )
    } else if (countries.length === 1) {
      return (
        <div>
          <Country value={countries} />
        </div>
      )
    } else if (countries.length === 0) {
      return (
        <p>Countries not found</p>
      )
    } else {
      return (
        <div>
          {countries.map(c =>
            <Countries key={c.name.area} c={c.name} />
          )}
        </div>
      )
    }
  }

  const handleFindCountriesChange = (event) => {
    setFindCountry(event.target.value)
  }

  return (
    <div>
      <Filter value={findCountry} onChange={handleFindCountriesChange}/>
      <CountriesList countries={countriesShow} />
    </div>
  )
}

export default App;