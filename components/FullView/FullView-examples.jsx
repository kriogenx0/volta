import FullView from './FullView';

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
        <div style={{ height: 200, border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
          <FullView>
            <div style={{ padding: 16 }}>
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
        <div style={{ padding: '12px 16px', background: '#f8f9fa', borderRadius: 6, fontSize: 13, color: '#555' }}>
          Pass <code>setScrollHeight</code> to automatically adjust height on window resize.
        </div>
      )
    },
  ]
};
