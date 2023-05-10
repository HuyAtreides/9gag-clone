import { getCountryCodeFromCountry } from '../../models/enums/country';

interface Props {
  readonly width?: number;
  readonly country?: string;
}

const DEFAULT_WIDTH = 15;

const CountryFlag: React.FC<Props> = ({ width = DEFAULT_WIDTH, country }) => {
  const code = getCountryCodeFromCountry(country);

  if (!code) {
    return null;
  }

  return (
    <img
      src={`${process.env.PUBLIC_URL}/flags/4x3/${code.toLocaleLowerCase()}.svg`}
      width={width}
      alt='country flag'
      title={country}
    />
  );
};

export default CountryFlag;
