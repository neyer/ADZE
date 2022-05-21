import React, { useState } from 'react'
import Constants from './Constants.js'
import { useSelector, useDispatch} from 'react-redux'

import { selectManifest , addPeerByUrl, removePeer, addLinkDoc } from './state/manifestSlice.js'
import { selectFeed, updateFeed  } from './state/feedSlice.js'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function FeedSection({isActive}) {
  const className = isActive ?  "" : "is-invisible";
  const styleType = isActive ? {} : Constants.invisibleStyle;

  const manifest = useSelector(selectManifest);
  const currentFeed = useSelector(selectFeed);

  const feedItems = currentFeed.links.map(feedItem => <SingleFeedLink key={feedItem.url} doc={feedItem}/>);

  const dispatch = useDispatch();
  const doFeedUpdate = () => {
     dispatch(updateFeed(manifest));
  }
  
  if (feedItems.length == 0)  {
    doFeedUpdate();
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
       <li key={doc.url.length}>
           <div className="columns">
             <div className="column is-two-fifths">
               <a href={doc.url}>{doc.title}</a>
             </div>
            <ProvenanceDescription provenance={doc.provenance}/>
            <div className="column">
              <LinkFeedbackPanel doc={doc}/>
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
        <span className="btn-see-provenance" onClick={ () => this.toggleView() }>&#x274C;</span>
        {this.getFullShareDescription()}
      </div>
    );
  }

  renderCompact() {
    const shortDesc = this.getCompactShareDescription();
    return ( 
      <div className="column is-two-fifths area-provenance-details">
        <span className="btn-see-provenance" onClick={() => this.toggleView() }>&#x1F50D;</span> Shared by {shortDesc}
      </div>
    );

  }

  getCompactShareDescription() {

    const provenance = this.props.provenance;
    if (typeof provenance === 'undefined') {
      return "unknown";
    }
    var adzeCountByOrder = [0,0,0,0,0];
     provenance.sharers.map((sharer) => {
        ++adzeCountByOrder[sharer.order];
     });
  
    var sharersDesc = "";
    var sharerParts = [];
    let hasAddedSharers = false;
    for (var peerOrder = 0; peerOrder < 4; ++ peerOrder) {
       var sharesByPeersOfThisOrder = adzeCountByOrder[peerOrder];
       if (sharesByPeersOfThisOrder == 0)  {
        continue;
       }
       if (peerOrder == 1){ 
           sharerParts.push(sharesByPeersOfThisOrder.toString() + " of your peers");
          continue;
       }
       let thisShareDesc = (sharesByPeersOfThisOrder.toString() + " order "  + 
              peerOrder.toString() + " peer");
       if  (sharesByPeersOfThisOrder > 1) {
            thisShareDesc += "s";
       }
       sharerParts.push(thisShareDesc);
    }


    return sharerParts.join(", ");;
  }

  getFullShareDescription() {
     // who as adzed this lnk

    const provenance = this.props.provenance;
    var clonedSharers = [...provenance.sharers];
     clonedSharers.sort(function(a,b) {
          return a.order - b.order;
     });
  
    const sharerElements = clonedSharers.map ((sharer, index) => {
      return <SingleSharerProvenance sharer={sharer} index={index} key={sharer.nickname}/>
    });
    return (
      <div>Shared by:
       <ul>{sharerElements}</ul>
      </div>
    )
  }
}

function SingleSharerProvenance({sharer, index}) {
    const [isAdded, setAdded] = useState(false);

    const dispatch = useDispatch();
    const handleAddPeer= (event) => {  
      // redo the whole feed when they add the peer
      setAdded(true);
      dispatch(addPeerByUrl(sharer.url));
    }

    if (sharer.order == 1 || isAdded) {
        // if they are already a peer, we don't add the link;
       return <li key={index}> {sharer.nickname}, (your peer)</li>;
    } 
    return (
       <li>{sharer.nickname} an order {sharer.order.toString()}  peer.
         <FontAwesomeIcon 
              icon="user-plus"
              title="Add this Peer"
              onClick={handleAddPeer}/>
       </li>
   );
 
}

function LinkFeedbackPanel({doc}) {
  const dispatch = useDispatch();
  const addThisDoc = (event) => {
    // make a copy without the provenance signals
    // and add in your own timestamp
    const newDoc = {
        timestamp: new Date().getTime(),
        url: doc.url,
        title: doc.title
    }
    dispatch(addLinkDoc(newDoc));
  }
  return (
      <FontAwesomeIcon
        icon="file-circle-plus"
        title="Recommend this Document"
        onClick={addThisDoc}
      />
  )
}


export default FeedSection
