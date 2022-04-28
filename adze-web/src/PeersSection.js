import Constants from './Constants.js'

function PeersSection({isActive}) {
  const className = isActive ?  "" : "is-invisible";
  const styleType = isActive ? {} : Constants.invisibleStyle;
  return (
      <div className={className} id="section-peers" style={styleType}>
            <div>
              <h2 className="title is-2">Adzed Peers</h2>
              <h3 className="subtitle is-3">Peers whose recommendations you are following</h3>
              <div className="field has-addons">
                <div className="control is-expanded">
                  <input className="input" type="text" id="input-peer-url" placeholder="put peer url here"></input>
                </div>
                <div className="control">
                  <a className="button" id="btn-add-peer">Adze Peer</a>
                </div>
              </div>
              <ul id="adze-peer-list"></ul>
          </div>
        </div>
  )
}


export default PeersSection
