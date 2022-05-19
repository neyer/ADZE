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
            <ProvenanceDescription provenance={doc.provenance}/>
            <div className="column">
              (feedback will go here)
             </div>
         </div>
      </li>
  );
}

class ProvenanceDescription extends React.Component {
    constructor(props) {
        super(props);
        this.state = { expanded: false }
   }

  render() {
     // who as adzed this lnk
    
    if (this.state.expanded) {
      return this.renderExpanded();
    } 
    return this.renderCompact();
  }

  toggleView() {
    this.setState({ expanded: !this.state.expanded});
  }

  renderExpanded() {
    return ( 
      <div className="column is-two-fifths area-provenance-details">
        <span class="btn-see-provenance" onClick={ () => this.toggleView() }>&#x274C;</span>
        {this.getFullShareDescription()}
      </div>
    );
  }

  renderCompact() {
    const shortDesc = this.getCompactShareDescription();
    return ( 
      <div className="column is-two-fifths area-provenance-details">
        <span class="btn-see-provenance" onClick={() => this.toggleView() }>&#x1F50D;</span> Shared by {shortDesc}
      </div>
    );

  }

  getCompactShareDescription() {

    const provenance = this.props.provenance;
    var adzeCountByOrder = [0,0,0,0,0];
     provenance.sharers.map((sharer) => {
        ++adzeCountByOrder[sharer.order];
     });
  
    var sharersDesc = "";
    let hasAddedSharers = false;
    for (var peerOrder = 0; peerOrder < 4; ++ peerOrder) {
       var sharesByPeersOfThisOrder = adzeCountByOrder[peerOrder];
       if (sharesByPeersOfThisOrder > 0)  {
          if (hasAddedSharers) {
            sharersDesc.push(", ");
          }
          var sharersDesc = sharesByPeersOfThisOrder.toString() + " order "  + 
              peerOrder.toString() + " peer";
          if (peerOrder == 1){ 
              sharersDesc =  sharesByPeersOfThisOrder.toString() + " of your peers";
          } else if  (sharesByPeersOfThisOrder > 1) {
            sharersDesc += 's';
          }
          
          
          hasAddedSharers = true;
       }
    }


    return sharersDesc;
  }

  getFullShareDescription() {
     // who as adzed this lnk

    const provenance = this.props.provenance;
     provenance.sharers.sort(function(a,b) {
          return a.order - b.order;
     });
  
    let resultStrings = [ 'Shared by:<ul>' ];
    const sharerElements = provenance.sharers.map ((sharer, index) => {
      return this.singleSharerProvenance(sharer, index);
    });
    return (
      <div>Shared by:
       <ul>{sharerElements}</ul>
      </div>
    )
  }

  singleSharerProvenance(sharer, index)  {
    if (sharer.order == 1) {
        // if they are already a peer, we don't add the link;
       return <li> {sharer.nickname}, (your peer)</li>;
    } 
    return (
       <li> {sharer.nickname} an order {sharer.order.toString()}  peer.
        <span class="link-adze-remote-peer"> Adze Them.</span>
       </li>
   );
  }
 
}

export default FeedSection
