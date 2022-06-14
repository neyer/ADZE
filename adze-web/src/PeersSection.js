import React from 'react';
import Constants from './Constants.js';

import { selectManifest , addPeerByUrl, removePeer } from './state/manifestSlice.js'
import { useSelector, useDispatch} from 'react-redux'

const SinglePeerElement = ({peer}) => {

  const dispatch = useDispatch();
  const removeThisPeer= ()=> {
    dispatch(removePeer(peer));
  };
  return (
      <li>
        <span onClick={removeThisPeer}>&#x274C;</span>
        <a href={peer.url}> {peer.nickname}</a>
    </li>
  );
}


function PeersSection({isActive}) {
  const className = isActive ?  "" : "is-invisible";
  const styleType = isActive ? {} : Constants.invisibleStyle;

  const manifest = useSelector(selectManifest);
  const dispatch = useDispatch();

  const peerItems = manifest.content.peers.map(peer=> <SinglePeerElement key={peer.url} peer={peer} />);


  const handleAddPeer= (event) => {  
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { inputPeerUrl } =  event.target.elements;

    console.log("adding a peerrr" +inputPeerUrl.value);
    dispatch(addPeerByUrl(inputPeerUrl.value));
  }


  const emptyPeerNote = manifest.content.peers.length > 0 ? null : (
    <div className="block">
      You don't have any peers! Find some people with good content and add their manifest links here.
    </div>
  )
  return (
      <div className={className} id="section-peers" style={styleType}>
            <div className="block">
              <h2 className="title is-2">Adzed Peers</h2>
              <h3 className="subtitle is-3">Peers whose recommendations you are following</h3>
              <form onSubmit={handleAddPeer} className="block">
                <div className="field has-addons">
                  <div className="control is-expanded">
                    <input 
                        className="input"
                        type="text" 
                        id="inputPeerUrl"
                         placeholder="put peer url here"></input>
                  </div>
                  <div className="control">
                    <button 
                       className="button"
                       type="submit"
                        id="btn-add-peer">
                        Adze Peer
                    </button>
                  </div>
                </div>
              </form>
              <ul id="adze-peer-list">{peerItems}</ul>
          </div>
         {emptyPeerNote}
        </div>
  )
}


export default PeersSection
