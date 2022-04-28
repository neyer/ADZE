import Constants from './Constants.js'

function LinksSection({isActive}) {
  const className = isActive ?  "" : "is-invisible";
  const styleType = isActive ? {} : Constants.invisibleStyle;
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


export default LinksSection
