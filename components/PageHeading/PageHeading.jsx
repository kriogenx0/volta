const PageHeading = ({ text, children }) => (
  <div className='c-page_heading clearfix l-space-v'>
    <div className='l-l'>
      <h1 className='l-space-none'>{text}</h1>
    </div>
    <div className='l-r'>
      {children}
    </div>
  </div>
);

export default PageHeading;
