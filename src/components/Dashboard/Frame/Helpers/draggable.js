class Draggable {
  constructor(elmnt, activeApp) {
    this.elmnt = elmnt;
    this.activeApp = activeApp;
    this.pos1 = 0;
    this.pos2 = 0;
    this.pos3 = 0;
    this.pos4 = 0;
  }

  elementDrag = (evt) => {
    const headerElement = document.querySelector(`.toolbar-header-${this.activeApp}`);
    if (headerElement) {
      headerElement.onmousedown = this.dragMouseDown;
      // calculate the new cursor position:
      this.pos1 = this.pos3 - evt.clientX;
      this.pos2 = this.pos4 - evt.clientY;
      this.pos3 = evt.clientX;
      this.pos4 = evt.clientY;
      // set the element's new position:
      this.elmnt.style.top = `${(this.elmnt.offsetTop - this.pos2)}px`;
      this.elmnt.style.left = `${(this.elmnt.offsetLeft - this.pos1)}px`;
    }
  }
  closeDragElement = () => {
    /* stop moving when mouse button is released: */
    document.onmouseup = null;
    document.onmousemove = null;
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
}

export default Draggable;

