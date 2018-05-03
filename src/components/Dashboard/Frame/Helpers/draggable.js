// Make the DIV element draggagle:
export default class Draggable {
  constructor(elmnt, appName) {
    this.elmnt = elmnt;
    this.appName = appName;
    this.pos1 = 0;
    this.pos2 = 0;
    this.pos3 = 0;
    this.pos4 = 0;
    this.bottomLimit = window.innerHeight - 100; // Height of the footer
    this.headerHeight = 45;

    if (document.querySelector(`.toolbar-header-${this.appName}`)) {
      this.headerHeight = document.querySelector(`.toolbar-header-${this.appName}`).clientHeight;
    }
  }
  dragElement = () => {
    if (this.elmnt) {
      if (document.querySelector(`.toolbar-header-${this.appName}`)) {
        document.querySelector(`.toolbar-header-${this.appName}`).onmousedown = this.dragMouseDown;
      }
      else {
        /* otherwise, move the DIV from anywhere inside the DIV: */
        this.elmnt.onmousedown = this.dragMouseDown;
      }
    }
  }
  dragMouseDown = (e) => {
    const evt = e || window.event;
    // get the mouse cursor position at startup:
    this.pos3 = evt.clientX;
    this.pos4 = evt.clientY;
    document.onmouseup = this.closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = this.elementDrag;
  }

  elementDrag = (e) => {
    const evt = e || window.event;
    // calculate the new cursor position:
    this.pos1 = this.pos3 - evt.clientX;
    this.pos2 = this.pos4 - evt.clientY;
    this.pos3 = evt.clientX;
    this.pos4 = evt.clientY;
    if (this.elmnt.offsetTop <= 0) {
      this.elmnt.style.top = '0';
    }
    if (evt.clientY >= this.bottomLimit) {
      this.elmnt.style.top = `${this.bottomLimit - this.headerHeight}px`;
    }
    // set the element's new position:
    this.elmnt.style.top = `${(this.elmnt.offsetTop - this.pos2)}px`;
    this.elmnt.style.left = `${(this.elmnt.offsetLeft - this.pos1)}px`;
  }

  closeDragElement = () => {
    /* stop moving when mouse button is released: */
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
