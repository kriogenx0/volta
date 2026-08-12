import './PageWidth.scss';

const PageWidth = ({ className, children }) => {
  // ironyoung-compat: c-page_width is the class name its own view-level scss targets directly.
  let pageWidthClassName = 'volta-page_width c-page_width';
  if (className) pageWidthClassName += ' ' + className;

  return (
    <div className={pageWidthClassName}>
      {children}
    </div>
  );
};

export default PageWidth;
