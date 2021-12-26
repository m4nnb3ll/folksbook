import React from 'react';
// FUNCTIONS
import imgNameSlicer from "../../myPlugins/functions/imgNameSlicer";

const ImgLoader = ({percent, order, complete, url, name}) => {
  
  return (
    <div className="img-loader" style={{"--img-background": `url(${url}) var(--second-color)`}}>
      <div className="img"></div>
      <div className="loading-details txt-small">
        <p className="img-name" >{ imgNameSlicer(name, 6) }</p>
        <div className="loading-bar" style={{"--loading-bar-length": `${percent}%`}}></div>
        <div className="loading-status">
          <span>{ order+1 }-</span>
          <p className="status">
            { complete ? <i className="fas fa-check">Added!</i> : null}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ImgLoader;