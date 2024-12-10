const EmailSVG = ({ ...props }) => {
  return (
    <svg
      width="12"
      height="10"
      viewBox="0 0 12 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11 2.71429L9.02178 3.8447C7.91889 4.47491 7.36744 4.79006 6.78344 4.9136C6.26656 5.02291 5.73344 5.02291 5.21656 4.9136C4.63258 4.79006 4.08113 4.47491 2.97822 3.8447L1 2.71429M2.77778 9H9.22222C9.8445 9 10.1557 9 10.3933 8.87543C10.6024 8.76589 10.7724 8.59103 10.8789 8.376C11 8.13154 11 7.81149 11 7.17143V2.82857C11 2.18851 11 1.86848 10.8789 1.62401C10.7724 1.40897 10.6024 1.23413 10.3933 1.12457C10.1557 1 9.8445 1 9.22222 1H2.77778C2.1555 1 1.84436 1 1.60668 1.12457C1.39761 1.23413 1.22763 1.40897 1.12111 1.62401C1 1.86848 1 2.18851 1 2.82857V7.17143C1 7.81149 1 8.13154 1.12111 8.376C1.22763 8.59103 1.39761 8.76589 1.60668 8.87543C1.84436 9 2.15549 9 2.77778 9Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EmailSVG;