const List = ({ countries, onShow }) => {
  return (
    <ul>
      {countries.map((country) => (
        <li key={country.cca3}>
          {country.name.common}{" "}
          <button onClick={() => onShow(country)}>show</button>
        </li>
      ))}
    </ul>
  );
};

export default List;
