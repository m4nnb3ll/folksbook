import React, { Component, createRef } from 'react';
// COMPONENTS
import ImgLoader from "./ImgLoader";

class ImgLoaderWrapper extends Component {
  
  wrapperRight = createRef();

  scrollToWrapperRight = () => {
    this.wrapperRight.current && this.wrapperRight.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  componentDidMount() {
    this.scrollToWrapperRight();
  }

  componentDidUpdate() {
    this.scrollToWrapperRight();
  }

  render() {
    const { imgState } = this.props;

    return (
      <div className="img-loader-wrapper">
        { imgState.imgsUploading.map((imgUploading) => {
          const { name, percent, order, complete, url, id } = imgUploading;
          return (
            <ImgLoader
              key={id}
              url={url}
              percent={percent}
              order={order}
              complete={complete}
              name={name}
            />);
        }) }
        <div ref={ this.wrapperRight }></div>
      </div>
    )
  }
}

export default ImgLoaderWrapper;