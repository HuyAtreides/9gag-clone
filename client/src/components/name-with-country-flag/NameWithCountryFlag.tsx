import CountryFlag from '../country-flag/CountryFlag';

interface Props {
  readonly name: string;
  readonly country?: string;
}

const NameWithCountryFlag: React.FC<Props> = ({ name, country }) => {
  return (
    <>
      {name} <CountryFlag country={country} />
    </>
  );
};

export default NameWithCountryFlag;
