import FullView from '../../components/FullView/FullView';

import './FullView-examples.scss';

export default {
  name: 'FullView',
  description: 'A full-height scrollable container that dynamically measures available viewport height.',
  examples: [
    {
      name: 'FullView',
      code: `<FullView>
  <p>This content fills available viewport height.</p>
</FullView>`,
      output: (
        <div className="example-full_view">
          <FullView>
            <div className="example-full_view-content">
              <p>FullView fills available viewport height. Typically used as a top-level page container.</p>
            </div>
          </FullView>
        </div>
      )
    },
    {
      name: 'With scroll height adjustment',
      code: `<FullView setScrollHeight>
  <LongContent />
</FullView>`,
      output: (
        <div className="example-full_view-note">
          Pass <code>setScrollHeight</code> to automatically adjust height on window resize.
        </div>
      )
    },
  ]
};
