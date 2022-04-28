import React from 'react'
import Constants from './Constants.js'

function FeedSection({isActive}) {
  const className = isActive ?  "" : "is-invisible";
  const styleType = isActive ? {} : Constants.invisibleStyle;
  return (
   <div className={className} id="section-feed" style={styleType}>
          <h2 className="title is-2">Adze Feed</h2>
          <h3 className="subtitle is-3">Recommended Links from your Peers</h3>
          <h6 id="text-feed-updated-timestamp" className="subtitle is-6">Last updated (not sure when)</h6>
          <div className="field">
           <div className="control">
              <a className="button" id="btn-update-feed">Stimulate my brain</a>
            </div>
          </div>
  
          <ul id="adze-feed-list"></ul>
    </div>
  )
}

export default FeedSection
