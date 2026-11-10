import { Children, cloneElement, createContext, isValidElement, useContext, useId } from 'react';

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

// FieldLabel, FieldHint and FieldRow mark themselves with `fieldPart` so a Field
// can tell them from the control: they are part of the field, not its control.
const partOf = (child) => (isValidElement(child) ? child.type?.fieldPart : undefined);

// The ids a Field or FieldRow needs, and its children with the parts wired up.
// With one control inside, the label points at it (`for`) and the control picks
// up the ids through the context. With several, they can't share an id, so the
// label names the group instead and nothing is injected. The label points at
// the one control's own `id` if it has one (so a native <input id="x"> works as
// it is); `htmlFor` names a control that isn't a direct child.
//
// A FieldLabel or FieldHint that is a direct child is part of the field: the
// label gets the control's id as its `for` (or names the group), and the hint
// is added to what describes the control. A FieldRow inside is a container
// with controls of its own, so the field names a group.
export const useFieldSetup = ({ htmlFor, label, hint, error, children }) => {
  const generatedId = useId();
  const items = Children.toArray(children);
  const controls = items.filter((child) => !partOf(child));
  const single = controls.length === 1 && !items.some((child) => partOf(child) === 'row');
  const only = single ? controls[0] : null;
  const childId = isValidElement(only) ? only.props.id : undefined;
  const controlId = htmlFor || childId || generatedId;
  const labelId = `${controlId}-label`;
  const ownHintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;

  const innerHintIds = items.filter((child) => partOf(child) === 'hint').map((child, i) => child.props.id || `${controlId}-hint-${i}`);
  const hintId = join(ownHintId, ...innerHintIds);
  const hasInnerLabel = items.some((child) => partOf(child) === 'label');

  let hintIndex = 0;
  const content = items.map((child) => {
    const part = partOf(child);
    if (part === 'label') {
      return cloneElement(child, {
        htmlFor: child.props.htmlFor ?? (single ? controlId : undefined),
        // The Field's own `label` already took this id
        id: child.props.id ?? (label ? undefined : labelId)
      });
    }
    if (part === 'hint') return cloneElement(child, { id: innerHintIds[hintIndex++] });
    return child;
  });

  return {
    controlId,
    labelId,
    hintId: ownHintId,
    errorId,
    single,
    hasLabel: Boolean(label) || hasInnerLabel,
    content,
    describedBy: join(hintId, errorId),
    context: single ? { id: controlId, hintId, errorId, invalid: Boolean(error) } : null
  };
};
