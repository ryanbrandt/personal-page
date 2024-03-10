const SuitcaseSvg = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    id="prefix__suitcase_icon"
    viewBox="0 0 240 192"
    width={20}
    height={20}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    <path
      className="prefix__body prefix__sides"
      d="M40 32v160H24a24 24 0 01-24-24V56a24 24 0 0124-24z"
    />
    <path className="prefix__body" d="M48 32h144v160H48z" />
    <path
      className="prefix__body prefix__sides"
      d="M200 32h16a24 24 0 0124 24v112a24 24 0 01-24 24h-16z"
    />
    <path d="M84 30V18a18 18 0 0118-18h36a18 18 0 0118 18v12h-12V18a6 6 0 00-6-6h-36a6 6 0 00-6 6v12z" />
  </svg>
);

export default SuitcaseSvg;
