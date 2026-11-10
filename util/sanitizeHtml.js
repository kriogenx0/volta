// Cleans HTML from an editor or a paste down to the small set of tags the rich
// text editor makes, so it is safe to store and to render again. Anything else is
// removed: scripts and styles with their content, unknown tags with their content
// kept, every attribute but a safe link's `href`.
//
//   sanitizeHtml('<p onclick="x()">Hi <b>there</b><script>x()</script></p>')
//   // => '<p>Hi <strong>there</strong></p>'

// Tag -> the tag it becomes. Browsers' editing commands make b, i, strike and div.
const ALLOWED = {
  p: 'p', h1: 'h1', h2: 'h2', h3: 'h3', blockquote: 'blockquote', pre: 'pre',
  ul: 'ul', ol: 'ol', li: 'li', br: 'br',
  strong: 'strong', b: 'strong', em: 'em', i: 'em', u: 'u',
  s: 's', strike: 's', del: 's', code: 'code', a: 'a',
  div: 'p'
};

// Removed along with everything inside them.
const DROPPED = new Set([
  'script', 'style', 'iframe', 'object', 'embed', 'noscript', 'template', 'svg', 'math',
  'form', 'input', 'button', 'textarea', 'select', 'link', 'meta', 'base', 'title', 'head'
]);

const SAFE_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

// A link address that can be kept: a web, mail or phone address, or one with no
// scheme at all (`/page`, `#top`, `page.html`). `javascript:`, `data:` and the like
// are not. Whitespace and control characters are removed first, since browsers
// ignore them inside a scheme ("java\tscript:").
export const safeHref = (href) => {
  const value = String(href || '').replace(/[\u0000- \u007f-\u009f]/g, '');
  if (!value) return null;
  const scheme = value.match(/^([a-z][a-z0-9+.-]*):/i);
  if (!scheme) return value;
  return SAFE_PROTOCOLS.includes(`${scheme[1].toLowerCase()}:`) ? value : null;
};

const clean = (node, doc) => {
  const out = doc.createDocumentFragment();

  node.childNodes.forEach((child) => {
    if (child.nodeType === 3) {
      out.appendChild(doc.createTextNode(child.nodeValue));
      return;
    }
    if (child.nodeType !== 1) return; // comments, processing instructions

    const name = child.nodeName.toLowerCase();
    if (DROPPED.has(name)) return;

    const inner = clean(child, doc);
    const tag = ALLOWED[name];
    if (!tag) {
      out.appendChild(inner); // unknown tag: keep what is inside it
      return;
    }

    const el = doc.createElement(tag);
    if (tag === 'a') {
      const href = safeHref(child.getAttribute('href'));
      if (!href) {
        out.appendChild(inner); // an unsafe or empty link is just its text
        return;
      }
      el.setAttribute('href', href);
      el.setAttribute('rel', 'noopener noreferrer');
    }
    el.appendChild(inner);
    out.appendChild(el);
  });

  return out;
};

export const sanitizeHtml = (html) => {
  if (html == null || html === '') return '';
  const parsed = new DOMParser().parseFromString(`<body>${html}`, 'text/html');
  const wrapper = parsed.createElement('div');
  wrapper.appendChild(clean(parsed.body, parsed));
  return wrapper.innerHTML;
};

export default sanitizeHtml;
