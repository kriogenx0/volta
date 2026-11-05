// A string with something in it (lodash has no isPresent; this used to be a
// global mixin that nothing here defines).
const isPresent = (value) => typeof value === 'string' ? value.trim() !== '' : value != null;

export default class NavItem {
  constructor(title, linkTo, key, extraClass, subHeading) {
    this.title = title || "untitled";
    this.subHeading = subHeading || this.title;
    this.linkTo = linkTo || "";
    this.key = key || this.title;
    this.extraClass = extraClass || "";
    this.query = {};

    this.children = [];
    this._isExpanded = true;
  }

  add(navItem) {
    this.children.push(navItem);
  }

  hasChildren() {
    return this.children.length !== 0;
  }

  hasLink() {
    return isPresent(this.linkTo);
  }

  isExpanded() {
    return this._isExpanded;
  }

  setExpanded(expanded) {
    this._isExpanded = expanded;
  }
}
