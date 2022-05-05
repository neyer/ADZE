import Constants from './Constants.js'
import { selectManifest } from './state/manifestSlice.js'
import { useSelector, useDispatch} from 'react-redux'


function ConfigureSection({isActive}) {
  const className = isActive ?  "" : "is-invisible";
  const styleType = isActive ? {} : Constants.invisibleStyle;

  const  manifest = useSelector(selectManifest);

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
      <p>Manifest Content:</p>
      <p>{JSON.stringify(manifest)}</p>
    </section>
  </div>
  )
}

export default ConfigureSection
