import './LoaderKnob.scss';

const LoaderKnob = ({ className }) => (
  <div className='c-loader_knob'>
    <div className={'knob-knob ' + className}>
    </div>
    {_.times(12, (i) => (
      <div key={i} className="knob-indicator" />
    ))}
  </div>
);

export default LoaderKnob;
