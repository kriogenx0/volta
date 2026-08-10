import "./Tag.scss";

const Tag = ({ children, deletable, onClick }) => {

  let className = 'v-tag';
  if (deletable) className += ' deletable';
  if (onClick) className += ' clickable';
  return (
    <span className={className} onClick={onClick}>
      {children} {deletable && <Icon type='xmark' /> }
    </span>
  );
};

export default Tag;