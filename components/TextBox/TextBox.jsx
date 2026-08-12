import TextField from '../TextField/TextField';

// TextBox is retained as a compatibility name for TextField.
// ironyoung-compat: c-text_box is the class name its own view-level scss targets directly.
const TextBox = (props) => <TextField wrapperClassName='c-text_box' {...props} />;

export default TextBox;
