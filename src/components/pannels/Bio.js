import React from 'react';
// FUNCTIONS
import breakText from "../../myPlugins/functions/breakText";
import cleanHtml from "../../myPlugins/functions/cleanHtml";

const Bio = ({text}) => {

  return (
    <div className="board bio">
      <h3 className="title">Bio:</h3>
      {
        text
          ? <p className="txt-op" dangerouslySetInnerHTML={{__html: cleanHtml(breakText(text))}}></p>
          : <p>"No Bio Yet..."</p>
      }
    </div>
  )
}

export default Bio;