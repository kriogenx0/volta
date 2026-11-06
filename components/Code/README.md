# Code

Shows a snippet of code: a syntax-highlighted block, or an inline `<code>` run inside text.

## When to use

- **Code samples in docs, examples and help text**: a block with `language`, or `inline` for a name or short command in a sentence.
- To let people copy a single value (an ID, a token) use [`ClipboardHover`](../ClipboardHover/README.md). Prose that merely mentions a word needs no component.
- It displays code. It does not edit it.

## Usage

```jsx
import { Code } from 'volta';

<>
  <Code language="bash">npm install volta</Code>
  <Code theme="light">{`<Button variant="primary">Save</Button>`}</Code>
  <p>Call <Code inline>onSelect</Code> when the user picks one.</p>
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `node` | | The code. Pass one string (a template literal for several lines); surrounding blank lines are trimmed. |
| `language` | `string` | `'jsx'` | The syntax to colour. `jsx`, `scss`, `bash` and `json` are registered. |
| `theme` | `'dark'` \| `'light'` | `'dark'` | Colours of the block: Prism's One Dark or One Light. `Code.themes` lists them. An unknown value gives `dark`. |
| `inline` | `bool` | `false` | Render an inline `<code>` with a subtle background instead of a block. No highlighting. |
| `className` | `string` | | Added to the root, after `volta-code`. |

Other props go to the root element (`data-*`, `aria-label`, ...).

## Variants and states

- **Block:** a `div.volta-code` holding the highlighted `<pre>`, with 6px corners and 12px text.
- **Inline:** a `code.volta-code.volta-code-inline` with a tinted background, sized at 0.9em of the text around it.
- `theme` is not the app's light or dark mode. The block keeps its own colours whichever mode the page is in, so pick `dark` or `light` to suit the surface it sits on.

## Accessibility

- A block is a `<pre><code>` of plain text, so a screen reader reads the code as text and it can be selected and copied.
- Colour is only decoration; the code reads the same without it.
- Long lines are not wrapped; they scroll sideways inside the block, so keep samples short for narrow screens.
- If a block needs a name, pass `aria-label` (it goes to the wrapper `div`).

## Do and don't

- Do set `language` to match the sample so it is highlighted correctly.
- Do keep lines short; they scroll sideways inside the block rather than wrapping.
- Don't pass JSX elements as `children` of a block; pass a string.
- Don't use `inline` for several lines; use a block.
- Don't use the block for a value people copy; use `ClipboardHover`.
