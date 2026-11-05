import Tooltip from '../../components/Tooltip/Tooltip';
import Button from '../../components/Button/Button';
import CloseButton from '../../components/CloseButton/CloseButton';

export default {
  name: 'Tooltip',
  description: 'Wraps any element and shows a short hint beside it on hover or keyboard focus. Without a title it shows nothing. Hover or tab to the examples to see them.',
  examples: [
    {
      name: 'Default (above)',
      code: `<Tooltip title="Saved to your library">
  <Button>Hover me</Button>
</Tooltip>`,
      output: (
        <Tooltip title="Saved to your library">
          <Button>Hover me</Button>
        </Tooltip>
      )
    },
    {
      name: 'Placement',
      code: `<Tooltip title="Shown to the right" gravity="right"><Button>Right</Button></Tooltip>
<Tooltip title="Shown above" gravity="up"><Button>Up</Button></Tooltip>
<Tooltip title="Shown below" gravity="down"><Button>Down</Button></Tooltip>
<Tooltip title="Shown to the left" gravity="left"><Button>Left</Button></Tooltip>`,
      output: (
        <div className="example-stack">
          <p>Hover each button. The tooltip opens on the side named by its label.</p>
          <div>
            <Tooltip title="Shown to the right" gravity="right"><Button>Right</Button></Tooltip>{' '}
            <Tooltip title="Shown above" gravity="up"><Button>Up</Button></Tooltip>{' '}
            <Tooltip title="Shown below" gravity="down"><Button>Down</Button></Tooltip>{' '}
            <Tooltip title="Shown to the left" gravity="left"><Button>Left</Button></Tooltip>
          </div>
        </div>
      )
    },
    {
      name: 'Distance from the trigger',
      code: `<Tooltip title="2px away" margin={2}><Button>Close</Button></Tooltip>
<Tooltip title="24px away" margin={24}><Button>Far</Button></Tooltip>`,
      output: (
        <div className="example-stack">
          <p>The margin prop sets the gap in pixels (8 by default).</p>
          <div>
            <Tooltip title="2px away" margin={2}><Button>Close</Button></Tooltip>{' '}
            <Tooltip title="24px away" margin={24}><Button>Far</Button></Tooltip>
          </div>
        </div>
      )
    },
    {
      name: 'Icon button, keyboard focus',
      code: `<Tooltip title="Close this panel" gravity="down">
  <CloseButton />
</Tooltip>`,
      output: (
        <div className="example-stack">
          <p>Tab to the button: the tooltip shows on focus and hides when focus leaves.</p>
          <div>
            <Tooltip title="Close this panel" gravity="down">
              <CloseButton />
            </Tooltip>
          </div>
        </div>
      )
    },
    {
      name: 'Long text wraps',
      code: `<Tooltip title="Tooltips wrap at 200px, so a longer explanation stays readable instead of running off the screen." gravity="right">
  <Button>Why is this disabled?</Button>
</Tooltip>`,
      output: (
        <Tooltip title="Tooltips wrap at 200px, so a longer explanation stays readable instead of running off the screen." gravity="right">
          <Button>Why is this disabled?</Button>
        </Tooltip>
      )
    }
  ]
};
