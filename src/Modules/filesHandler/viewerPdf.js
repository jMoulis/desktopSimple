import React from 'react';
import PropTypes from 'prop-types';
import PdfJs from 'pdfjs-dist';
import { CSSTransition } from 'react-transition-group';
import './viewerPdf.css';

class ViewerPdf extends React.Component {
  static propTypes = {
    doc: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      viewer: {
        display: true,
        pdfRaw: props.doc,
        zoom: 1.5,
        page: 1,
        totalPages: 1,
      },
      enterTimeout: 150,
      exitTimeout: 100,
    };
  }
  componentDidMount() {
    this.renderPage({ value: this.state.viewer.pdfRaw });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.viewer.page !== prevState.viewer.page ||
      this.state.viewer.zoom !== prevState.viewer.zoom) {
      this.renderPage({ value: this.state.viewer.pdfRaw });
    }
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
  handleNavigate = (evt) => {
    const { id } = evt.target;
    const { viewer } = this.state;
    this.setState((prevState) => {
      switch (id) {
        case 'next': {
          if (viewer.page < viewer.totalPages) {
            return {
              ...prevState,
              viewer: {
                ...prevState.viewer,
                page: prevState.viewer.page + 1,
              },
            };
          }
          return {
            ...prevState,
          };
        }
        case 'prev': {
          if (viewer.page > 1) {
            return {
              ...prevState,
              viewer: {
                ...prevState.viewer,
                page: prevState.viewer.page - 1,
              },
            };
          }
          return {
            ...prevState,
          };
        }
        default:
          break;
      }
      return {
        ...prevState,
      };
    });
  }
  handleZoom = (evt) => {
    const { id } = evt.target;
    let value;
    if (id === 'minus') {
      value = -0.1;
    }
    else {
      value = 0.1;
    }
    this.setState(prevState => ({
      viewer: {
        ...prevState.viewer,
        zoom: prevState.viewer.zoom + value,
      },
    }));
  }
  trimBase64 = doc => new Promise((resolve) => {
    resolve(doc.value.replace('data:application/pdf;base64,', ''));
  });
  renderPage = (doc) => {
    this.trimBase64(doc)
      .then((newEncodedString) => {
        const pdfData = atob(newEncodedString);
        const canvas = document.getElementById('canvas-viewer');
        const context = canvas.getContext('2d');
        PdfJs.getDocument({ data: pdfData }).then((pdf) => {
          pdf.getPage(this.state.viewer.page)
            .then((page) => {
              const scale = this.state.viewer.zoom;
              const viewport = page.getViewport(scale);
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              const renderContext = {
                canvasContext: context,
                viewport,
              };
              page.render(renderContext);
            });
          this.setState(prevState => ({
            ...prevState,
            viewer: {
              ...prevState.viewer,
              totalPages: pdf.numPages,
            },
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
          <div className="viewer-content">
            <div className="btn-container">
              <button type="button" id="plus" onClick={this.handleZoom}>plus</button>
              <button type="button" id="minus" onClick={this.handleZoom}>minus</button>
              <button type="button" onClick={this.handleCloseViewer}>close</button>
              <button type="button" id="prev" onClick={this.handleNavigate}>prev</button>
              <button type="button" id="next" onClick={this.handleNavigate}>next</button>
            </div>
            <div className="canvas-container">
              <canvas id="canvas-viewer" />
            </div>
          </div>
        </div>
      </CSSTransition>
    );
  }
}

export default ViewerPdf;
