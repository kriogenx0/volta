import './LoaderBars.scss';

const LoaderBars = (props) => (
  <div {...props} className='c-load_bars'>
    <div className='spinner'>
      <div className='rect1'></div>
      <div className='rect2'></div>
      <div className='rect3'></div>
      <div className='rect4'></div>
      <div className='rect5'></div>
    </div>
  </div>
);

export default LoaderBars;
