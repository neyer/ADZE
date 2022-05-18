import React from 'react'
import Constants from './Constants.js'
import { useSelector, useDispatch} from 'react-redux'

import { selectManifest } from './state/manifestSlice.js'
import { selectFeed, updateFeed  } from './state/feedSlice.js'


function FeedSection({isActive}) {
  const className = isActive ?  "" : "is-invisible";
  const styleType = isActive ? {} : Constants.invisibleStyle;

  const manifest = useSelector(selectManifest);
  const currentFeed = useSelector(selectFeed);

  const feedItems = currentFeed.links.map(feedItem => <SingleFeedLink doc={feedItem}/>);

  const dispatch = useDispatch();
  const doFeedUpdate = () => {
     dispatch(updateFeed(manifest));
  }
  
  const lastUpdateText = new Date(currentFeed.meta.timestamp).toLocaleString();

  return (
   <div className={className} id="section-feed" style={styleType}>
          <h2 className="title is-2">Adze Feed</h2>
          <h3 className="subtitle is-3">Recommended Links from your Peers</h3>
          <h6 id="text-feed-updated-timestamp" className="subtitle is-6">Last updated {lastUpdateText}</h6>

          <div className="field">
           <div className="control" onClick={doFeedUpdate}>
              <a className="button" id="btn-update-feed">Stimulate my brain</a>
            </div>
          </div>
  
          <ul id="adze-feed-list">{feedItems}</ul>
    </div>
  )
}

function SingleFeedLink({doc}) {
  // upvote adze it to your own list of links
  // gives you the option of following the peer if you aren't already
  // downvote removes it from your feed, adze it to your list of 'no good'
  // links, and gives the option of removing that peer

  return (
       <li key={doc.url}>
           <div className="columns">
             <div className="column is-two-fifths">
               <a href={doc.url}>{doc.title}</a>
             </div>
             <div className="column is-two-fifths area-provenance-details">
               (provenance goes here)
             </div>
             <div className="column">
              (feedback will go here)
             </div>
         </div>
      </li>
  );
}

export default FeedSection
