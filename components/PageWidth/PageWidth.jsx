import './PageWidth.scss';

const PageWidth = ({ className, children }) => {
  let pageWidthClassName = 'c-page_width';
  if (className) pageWidthClassName += ' ' + className;

  return (
    <div className={pageWidthClassName}>
      {children}
    </div>
  );
};

export default PageWidth;
