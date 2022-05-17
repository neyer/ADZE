import React from 'react'
import Constants from './Constants.js'
import { useSelector, useDispatch} from 'react-redux'

import { selectManifest } from './state/manifestSlice.js'
import { selectFeed  } from './state/feedSlice.js'


function FeedSection({isActive}) {
  const className = isActive ?  "" : "is-invisible";
  const styleType = isActive ? {} : Constants.invisibleStyle;

  const manifest = useSelector(selectManifest);

  const feedItems = useSelector(selectFeed).map(feedItem => <SingleFeedLink doc={feedItem}/>);
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
  
          <ul id="adze-feed-list">{feedItems}</ul>
    </div>
  )
}

function SingleFeedLink({doc}) {
  return (
        <li key={doc.url}>
          <span>&#x274C;</span>
          <a href={doc.url}>{doc.title}</a>
      </li>

  );
}

export default FeedSection
