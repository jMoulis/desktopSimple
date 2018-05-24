import React from 'react';
import PropTypes from 'prop-types';
import PdfJs from 'pdfjs-dist';
import { PDFViewer, PDFFindController } from 'pdfjs-dist/web/pdf_viewer';
import { CSSTransition } from 'react-transition-group';
import './viewerPdf.css';
import '../../../node_modules/pdfjs-dist/web/pdf_viewer.css';

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
      },
      enterTimeout: 150,
      exitTimeout: 100,
    };
    PdfJs.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.js';
  }
  componentDidMount() {
    this.renderPage({ value: this.state.viewer.pdfRaw }, this.state.viewer.scaleValue);
    const container = document.querySelector('.viewer-container');
    this.pdfViewer = new PDFViewer({
      container,
    });
    this.scrollByDragging(container);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.viewer.page !== prevState.viewer.page ||
      this.state.viewer.scaleValue !== prevState.viewer.scaleValue) {
      this.pdfViewer.currentScaleValue = this.state.viewer.scaleValue;
    }
  }
  scrollByDragging = (element) => {
    let curYPos;
    let curXPos;
    let curDown;
    element.addEventListener('mousemove', (e) => {
      if (curDown) {
        element.scrollTo({
          top: element.scrollTop + ((curYPos - e.pageY) * 5),
          left: element.scrollLeft + ((curXPos - e.pageX) * 5),
          behavior: 'smooth',
        });
      }
    });
    element.addEventListener('mousedown', (e) => {
      curYPos = e.pageY;
      curXPos = e.pageX;
      curDown = true;
    });

    element.addEventListener('mouseup', () => {
      curDown = false;
    });
  }
  handleCloseViewer = (evt) => {
    // Show modal with huge canvas
    const pdfRaw = evt.target.dataset.b64;
    const { close } = this.props;
    close(this.state.exitTimeout);
    this.setState(prevState => ({
      viewer: {
        ...prevState.viewer,
        display: false,
        pdfRaw,
      },
    }));
  }
  handleZoom = (evt) => {
    const { id } = evt.currentTarget;
    this.setState((prevState) => {
      switch (id) {
        case 'minus':
          if (this.state.viewer.scaleValue <= 0.5) {
            return {
              ...prevState,
            };
          }
          return ({
            ...prevState,
            viewer: {
              ...prevState.viewer,
              scaleValue: prevState.viewer.scaleValue - 0.5,
            },
          });
        case 'plus':
          return {
            ...prevState,
            viewer: {
              ...prevState.viewer,
              scaleValue: prevState.viewer.scaleValue + 0.5,
            },
          };
        default:
          return {
            ...prevState,
          };
      }
    });
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
    return (
      <CSSTransition
        in={this.state.viewer.display}
        timeout={{
          enter: this.state.enterTimeout,
          exit: this.state.exitTimeout,
        }}
        classNames="viewer"
        appear
        unmountOnExit
      >
        <div key="viewer" className="viewer">
          <ul className="btn-container">
            <li>
              <button
                className="viewer-toolbar-item"
                id="plus"
                type="button"
                onClick={this.handleZoom}
              >
                <i className="fas fa-search-plus" />
              </button>
              <button
                className="viewer-toolbar-item"
                id="minus"
                type="button"
                onClick={this.handleZoom}
              >
                <i className="fas fa-search-minus" />
              </button>
            </li>
            <li>
              <a
                className="viewer-toolbar-item"
                download
                href={this.state.viewer.pdfRaw}
              >
                <i className="fas fa-download" />
              </a>
              <button
                className="viewer-toolbar-item viewer-toolbar-item--close"
                type="button"
                onClick={this.handleCloseViewer}
              >
                <i className="fas fa-times-circle" />
              </button>
            </li>
          </ul>
          <div className="viewer-container">
            <div id="viewer" className="pdfViewer" />
          </div>
        </div>
      </CSSTransition>
    );
  }
}

export default ViewerPdf;
