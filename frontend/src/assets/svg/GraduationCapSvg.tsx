const GraduationCapSvg = (
  props: React.SVGProps<SVGSVGElement>
): JSX.Element => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <svg viewBox="0 0 100 100" width={20} height={20} {...props}>
    <path d="M83.781 75.269l2.586-2.586 2.587 2.586V50.216l-5.173 2.298z" />
    <path d="M93.912 39.711L52.57 19.006c-1.413-.708-3.726-.708-5.139 0L6.088 39.711c-1.413.708-1.455 1.944-.094 2.746L44.51 65.153l.026.015-25.574-11.445v7.495c0 1.581 1.114 3.531 2.476 4.333l26.086 15.371c1.362.803 3.59.803 4.952 0l26.086-15.371c1.362-.803 2.476-2.752 2.476-4.333v-7.486L55.951 64.881l38.055-22.424c1.361-.803 1.319-2.039-.094-2.746z" />
  </svg>
);

export default GraduationCapSvg;
