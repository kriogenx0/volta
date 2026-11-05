import PropTypes from 'prop-types';

import './PageHeading.scss';

const PageHeading = ({ text, children }) => (
  <div className='volta-page_heading clearfix l-space-v'>
    <div className='l-l'>
      <h1 className='l-space-none'>{text}</h1>
    </div>
    <div className='l-r'>
      {children}
    </div>
  </div>
);

PageHeading.propTypes = {
  text: PropTypes.node,
  children: PropTypes.node // actions shown opposite the title
};

export default PageHeading;
