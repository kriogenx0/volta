import sanitizeHtml, { safeHref } from '../../util/sanitizeHtml';

describe('sanitizeHtml', () => {
  it('keeps the tags the editor makes', () => {
    const html = '<h1>T</h1><p>a <strong>b</strong> <em>c</em> <u>d</u> <s>e</s> <code>f</code></p><blockquote>q</blockquote><pre>p</pre><ul><li>x</li></ul><ol><li>y</li></ol><p>l<br>m</p>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it('turns the tags a browser editing command makes into the editor\'s own', () => {
    expect(sanitizeHtml('<div><b>a</b><i>b</i><strike>c</strike><del>d</del></div>'))
      .toBe('<p><strong>a</strong><em>b</em><s>c</s><s>d</s></p>');
  });

  it('removes scripts, styles and embeds with their content', () => {
    expect(sanitizeHtml('<p>a</p><script>alert(1)</script><style>p{}</style><iframe src="x">y</iframe><svg><circle/></svg>'))
      .toBe('<p>a</p>');
    expect(sanitizeHtml('<form><input value="x"><button>go</button></form>')).toBe('');
  });

  it('removes every attribute but a safe link\'s href', () => {
    expect(sanitizeHtml('<p onclick="x()" style="color:red" class="c" id="i" onmouseover="y()">a</p>')).toBe('<p>a</p>');
    expect(sanitizeHtml('<strong onclick="x()">a</strong>')).toBe('<strong>a</strong>');
    expect(sanitizeHtml('<a href="https://example.com" onclick="x()" target="_blank" style="x">a</a>'))
      .toBe('<a href="https://example.com" rel="noopener noreferrer">a</a>');
  });

  it('keeps the text of an unknown tag and of an unsafe link', () => {
    expect(sanitizeHtml('<p><font color="red">a</font> <span>b</span></p>')).toBe('<p>a b</p>');
    expect(sanitizeHtml('<a href="javascript:alert(1)">a</a>')).toBe('a');
    expect(sanitizeHtml('<a>a</a>')).toBe('a');
  });

  it('does not let markup through as text or in comments', () => {
    expect(sanitizeHtml('<!-- <script>x</script> --><p>&lt;script&gt;x&lt;/script&gt;</p>'))
      .toBe('<p>&lt;script&gt;x&lt;/script&gt;</p>');
  });

  it('copes with empty and missing input and with broken markup', () => {
    expect(sanitizeHtml('')).toBe('');
    expect(sanitizeHtml(null)).toBe('');
    expect(sanitizeHtml(undefined)).toBe('');
    expect(sanitizeHtml('<p>a<strong>b')).toBe('<p>a<strong>b</strong></p>');
    expect(sanitizeHtml('plain text')).toBe('plain text');
  });

  it('is stable: cleaning clean html changes nothing', () => {
    const once = sanitizeHtml('<div><b>a</b> <a href="/x">b</a></div><script>x</script>');
    expect(sanitizeHtml(once)).toBe(once);
  });
});

describe('safeHref', () => {
  it('allows web, mail and phone addresses and addresses with no scheme', () => {
    ['https://a.com', 'http://a.com/x?y=1', 'mailto:a@b.com', 'tel:+15551234', '/page', '#top', 'page.html', 'HTTPS://A.COM']
      .forEach((href) => expect(safeHref(href)).toBe(href));
  });

  it('refuses scripts and other schemes, even disguised', () => {
    ['javascript:alert(1)', 'JaVaScRiPt:alert(1)', ' javascript:alert(1)', 'java\tscript:alert(1)', 'java\nscript:alert(1)',
      'data:text/html,<script>x</script>', 'vbscript:x', 'file:///etc/passwd', '\u0001javascript:x']
      .forEach((href) => expect(safeHref(href)).toBeNull());
  });

  it('refuses nothing as an address', () => {
    expect(safeHref('')).toBeNull();
    expect(safeHref(null)).toBeNull();
    expect(safeHref('   ')).toBeNull();
  });
});
