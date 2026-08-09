import './LoaderClock.scss';

const LoaderClock = ({ className }) => (
  <div className='c-loader_clock'>
    <div className={'clock-clock ' + (className || '')}>
    </div>
  </div>
);

export default LoaderClock;
