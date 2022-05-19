import Constants from './Constants.js'

import { selectManifest , addPeerByUrl } from './state/manifestSlice.js'
import { useSelector, useDispatch} from 'react-redux'

const SinglePeerElement = ({peer}) => {
  return (
      <li>
        <span>&#x274C;</span>
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

  return (
      <div className={className} id="section-peers" style={styleType}>
            <div>
              <h2 className="title is-2">Adzed Peers</h2>
              <h3 className="subtitle is-3">Peers whose recommendations you are following</h3>
              <form onSubmit={handleAddPeer}>
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
        </div>
  )
}


export default PeersSection
