import { useState, useEffect } from "react";
import axios from "axios";
import Details from "./components/details";
import List from "./components/list";

const App = () => {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => setCountries(response.data));
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setFiltered([]);
      setSelectedCountry(null);
      return;
    }

    const results = countries.filter((c) =>
      c.name.common.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(results);

    if (results.length === 1) {
      setSelectedCountry(results[0]);
    } else {
      setSelectedCountry(null);
    }
  }, [query, countries]);

  const handleShowClick = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div>
      <label>
        Find countries:{" "}
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>

      {filtered.length > 10 && <p>Too many matches, specify another filter.</p>}

      {filtered.length > 1 && filtered.length <= 10 && (
        <List countries={filtered} onShow={handleShowClick} />
      )}

      {selectedCountry && <Details country={selectedCountry} />}
    </div>
  );
};

export default App;