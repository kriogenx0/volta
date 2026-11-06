import { Children, createContext, isValidElement, useContext, useId } from 'react';

// What a Field (or FieldRow) tells the control inside it, so the control, its
// label, hint and error are connected for assistive technology:
//   id        the control's id, which the label's `for` points at
//   hintId    the id of the hint, if there is one
//   errorId   the id of the error message, if there is one
//   invalid   whether there is an error
export const FieldContext = createContext(null);

const join = (...ids) => ids.filter(Boolean).join(' ') || undefined;

// The attributes a control puts on its input. Its own props win; inside a Field it
// otherwise gets the Field's id, is described by the Field's hint and error, and
// is marked invalid when the Field has an error.
export const useFieldControl = ({ id, 'aria-describedby': describedBy, 'aria-invalid': invalid } = {}) => {
  const field = useContext(FieldContext);
  if (!field) return { id, 'aria-describedby': describedBy, 'aria-invalid': invalid };

  return {
    id: id || field.id,
    'aria-describedby': join(describedBy, field.hintId, field.errorId),
    'aria-invalid': invalid || (field.invalid ? true : undefined)
  };
};

// The ids a Field or FieldRow needs. With one control inside, the label points at
// it (`for`) and the control picks up the ids through the context. With several,
// they can't share an id, so the label names the group instead and nothing is
// injected. The label points at the one control's own `id` if it has one (so a
// native <input id="x"> works as it is); `htmlFor` names a control that isn't a
// direct child.
export const useFieldSetup = ({ htmlFor, hint, error, children }) => {
  const generatedId = useId();
  const single = Children.count(children) === 1;
  const only = single ? Children.toArray(children)[0] : null;
  const childId = isValidElement(only) ? only.props.id : undefined;
  const controlId = htmlFor || childId || generatedId;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;

  return {
    controlId,
    labelId: `${controlId}-label`,
    hintId,
    errorId,
    single,
    describedBy: join(hintId, errorId),
    context: single ? { id: controlId, hintId, errorId, invalid: Boolean(error) } : null
  };
};
