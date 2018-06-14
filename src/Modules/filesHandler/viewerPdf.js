import React from 'react';
import PropTypes from 'prop-types';
import PdfJs from 'pdfjs-dist';
import { PDFViewer, PDFFindController } from 'pdfjs-dist/web/pdf_viewer';
import { CSSTransition } from 'react-transition-group';
import './viewerPdf.css';
import '../../../node_modules/pdfjs-dist/web/pdf_viewer.css';
import ViewerToolbar from './viewerToolbar';

class ViewerPdf extends React.Component {
  static propTypes = {
    doc: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
  }
  static trimBase64 = doc => new Promise((resolve) => {
    resolve(doc.value.replace('data:application/pdf;base64,', ''));
  });
  constructor(props) {
    super(props);
    this.state = {
      viewer: {
        display: true,
        pdfRaw: props.doc,
        scaleValue: 1,
        curYPos: null,
        curXPos: null,
        curDown: false,
      },
      enterTimeout: 150,
      exitTimeout: 100,
    };
    PdfJs.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.js';
    this.container = React.createRef();
  }
  componentDidMount() {
    this.renderPage({ value: this.state.viewer.pdfRaw }, this.state.viewer.scaleValue);
    const container = this.container.current;
    this.pdfViewer = new PDFViewer({
      container,
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.viewer.page !== prevState.viewer.page ||
      this.state.viewer.scaleValue !== prevState.viewer.scaleValue) {
      this.pdfViewer.currentScaleValue = this.state.viewer.scaleValue;
    }
  }
  setScaleValue = (scaleValue) => {
    this.setState(prevState => ({
      ...prevState,
      viewer: {
        ...prevState.viewer,
        scaleValue: prevState.viewer.scaleValue + scaleValue,
      },
    }));
  }
  handleCloseViewer = () => {
    this.setState(prevState => ({
      viewer: {
        ...prevState.viewer,
        display: false,
      },
    }));
  }
  _onMouseDown = (evt) => {
    const { pageY, pageX } = evt;
    this.setState(prevState => ({
      ...prevState,
      viewer: {
        ...prevState.viewer,
        curYPos: pageY,
        curXPos: pageX,
        curDown: true,
      },
    }));
  }
  _onMouseMove = (evt) => {
    const element = evt.currentTarget;
    const { pageY, pageX } = evt;
    if (this.state.viewer.curDown) {
      element.scrollTo({
        top: element.scrollTop + ((this.state.viewer.curYPos - pageY) * 5),
        left: element.scrollLeft + ((this.state.viewer.curXPos - pageX) * 5),
        behavior: 'smooth',
      });
    }
  }
  _onMouseUp = () => {
    this.setState(prevState => ({
      ...prevState,
      viewer: {
        ...prevState.viewer,
        curDown: false,
      },
    }));
  }
  renderPage = (doc, scale) => {
    ViewerPdf.trimBase64(doc)
      .then((newEncodedString) => {
        const SEARCH_FOR = 'Mozilla';
        const pdfData = atob(newEncodedString);
        const container = document.querySelector('.viewer-container');
        const pdfFindController = new PDFFindController({
          pdfViewer: this.pdfViewer,
        });
        this.pdfViewer.setFindController(pdfFindController);
        container.addEventListener('pagesinit', () => {
          this.pdfViewer.currentScaleValue = scale;
          if (SEARCH_FOR) {
            pdfFindController.executeCommand('find', { query: SEARCH_FOR });
          }
        });
        PdfJs.getDocument({ data: pdfData })
          .then((pdf) => {
            this.pdfViewer.setDocument(pdf);
            this.setState(prevState => ({
              ...prevState,
              pdfViewer: this.pdfViewer,
            }));
          });
      });
  }
  render() {
    const { close } = this.props;
    return (
      <CSSTransition
        in={this.state.viewer.display}
        timeout={{
          enter: this.state.enterTimeout,
          exit: this.state.exitTimeout,
        }}
        classNames="viewer"
        appear
        onExited={() => close()}
        unmountOnExit
      >
        <div key="viewer" className="viewer">
          <ViewerToolbar
            setScaleValueAction={this.setScaleValue}
            closeViewerAction={this.handleCloseViewer}
            pdf={this.state.viewer.pdfRaw}
            scaleValue={this.state.viewer.scaleValue}
          />
          <div
            ref={this.container}
            className="viewer-container"
            onMouseDown={this._onMouseDown}
            onMouseUp={this._onMouseUp}
            onMouseMove={this._onMouseMove}
          >
            <div id="viewer" className="pdfViewer" />
          </div>
        </div>
      </CSSTransition>
    );
  }
}

export default ViewerPdf;
