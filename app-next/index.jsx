const app = document.getElementById('app');

const INVISIBLE_STYLE = {height: '0px', padding: '0px'};


function MainContainer() {
return (
  <section className="section">
  <div className="container">
    <p className="title">Adze Recommendation Protocol</p>
    <TabSelector />
  </div>
  </section>
  )
}


function TabSelector() {

  const [currentTab, setTab] = React.useState('feed');

  const inactiveStyle = { height:'0px', padding:'0px' };

  function getClassForTabSelector(tabName) {
    return tabName === currentTab ? "is-active" : "";
  }

  return  (
  <div>
    <div className="tabs is-medium is-centered">
        <ul>
          <li className={getClassForTabSelector("feed")} id="btn-select-tab-feed"><a onClick={()=> setTab("feed") }>feed</a></li>
          <li className={getClassForTabSelector("links")} id="btn-select-tab-links"><a onClick={()=> setTab("links") }>my links</a></li>
          <li className={getClassForTabSelector("peers")} id="btn-select-tab-peers"><a onClick={()=> setTab("peers") }>my peers</a></li>
          <li className={getClassForTabSelector("setup")} id="btn-select-tab-setup"><a onClick={()=> setTab("setup") }>setup</a></li>
         </ul>
    </div>
    <FeedSection  isActive={currentTab == "feed"} />
    <LinksSection isActive={currentTab == "links"} />
    <PeersSection isActive={currentTab == "peers"} />
    <SetupSection isActive={currentTab == "setup"} />
  </div>
 )
}

function FeedSection({isActive}) {
  const className = isActive ?  "" : "is-invisible";
  const styleType = isActive ? {} : INVISIBLE_STYLE;
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


function LinksSection({isActive}) {
  const className = isActive ?  "" : "is-invisible";
  const styleType = isActive ? {} : INVISIBLE_STYLE;
  return (
    <div className={className} id="section-links" style={styleType}>
         <h2 className="title is-2">Adzed Links</h2>
         <h3 className="subtitle is-3">Links you are recommending</h3>
         <h3 className="subtitle is-6">You need valid credentials in the 'setup' tab first</h3>
            <div className="field has-addons">
                    <div className="control is-expanded">
                      <input className="input" type="text" id="input-link-url" placeholder="put links to good content here"></input>
                    </div>
                    <div className="control">
                      <a className="button" id="btn-add-link">Adze Link</a>
                    </div>
              </div>
             <ul id="adze-link-list"></ul>
       </div>
  )
}

function PeersSection({isActive}) {
  const className = isActive ?  "" : "is-invisible";
  const styleType = isActive ? {} : INVISIBLE_STYLE;
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

function SetupSection({isActive}) {
  const className = isActive ?  "" : "is-invisible";
  const styleType = isActive ? {} : INVISIBLE_STYLE;
  return (
  <div className={className} id="section-setup" style={styleType}>
    <h3 className="title is-3">For Uploadin'</h3>

       <p id="hub-credentials-form-desc">Adze needs your recommendations to be posted somewhere on the web where any other adze user can read them. To simplify this, you can use recommendation hosting service, called a hub. By default, the plugin uses the adze "origin hub", but anyone can host their own.</p>
      <section className="section" id="hub-credentials-form">
          <form id="hub-credentials-form">
            <div className="field">
              <label className="label">Hub address</label>
              <div className="control">
                  <input className="input" id="hub-address" defaultValue="https://adze-web.anvil.app/_/api/"></input>
              </div>
              <p className="help">Address of a service that will host your recommendations. The default value is operated by the adze network creator.</p>
            </div>
            <div className="field">
              <label className="label">Hub username</label>
              <div className="control">
                  <input className="input" id="hub-username"></input>
              </div>
              <p className="help"> Your name on the above adze hub. Pick a new name here to register.</p>
            </div>
            <div className="field">
              <label className="label">Email Address</label>
              <div className="control">
                  <input className="input" id="hub-email"></input>
              </div>

              <p className="help">Optional; the origin hub does not share this, and only uses your email address for recovery. Other hubs may have different policies.</p>
            </div>
            <div className="field">
             <div className="control">
              <a className="button" id="btn-set-hub-credentials">Confirm hub username</a>
              </div>
             </div>
          <p id="hub-credentials-form-message"></p>
          </form>

    </section>
    <section className="section" id="hub-upload-form" style={{visbility:'hidden'}}>
        <div className="field">
         <div className="control">
            <a className="button" id="btn-upload-hub">Upload</a>
          </div>
       </div>
      <h3 className="title is-3">For Debuggin'</h3>
      <p id="message"></p>
    </section>
  </div>
  )
}

ReactDOM.render(<MainContainer />, app);

