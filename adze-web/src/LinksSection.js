import React from 'react'


import Constants from './Constants.js'

import { selectManifest , addLinkByUrl } from './state/manifestSlice.js'
import { selectCredentials  } from './state/credentialsSlice.js'
import { useSelector, useDispatch} from 'react-redux'

import { ErrorMessageOrNull, ManifestStatusMessage} from './notifications.js'


class SingleLinkElement extends React.Component {
   // upvote adze it to your own list of links
  // gives you the option of following the peer if you aren't already
   // downvote removes it from your feed, adze it to your list of 'no good'
  // links, and gives the option of removing that peer

  render() {
    const { link } = this.props;
    return (
        <li>
          <span>&#x274C;</span>
          <a href={link.url}> {link.title}</a>
      </li>
    );
  }
}

function LinksSection({isActive}) {
  const className = isActive ?  "" : "is-invisible";
  const styleType = isActive ? {} : Constants.invisibleStyle;
  const manifest = useSelector(selectManifest);
  const credentials = useSelector(selectCredentials);
  const dispatch = useDispatch();

  const linkItems = manifest.content.sites.map(site => <SingleLinkElement key={site.url} link={site} />);


  const handleAddLink = (event) => {  
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { inputLinkUrl } =  event.target.elements;

    dispatch(addLinkByUrl({credentials: credentials, link: inputLinkUrl.value}));
  }
  return (
    <div className={className} id="section-links" style={styleType}>
         <h2 className="title is-2">Adzed Links</h2>
         <h3 className="subtitle is-3">Links you are recommending</h3>
        <ManifestStatusMessage credentials={credentials}/>
          <form onSubmit={handleAddLink}>
            <div className="field has-addons">
                    <div className="control is-expanded">
                      <input className="input" type="text" id="inputLinkUrl" placeholder="put links to good content here"></input>
                    </div>
                    <div className="control">
                      <button 
                          className="button"
                          type="submit"
                          id="btn-add-link">Adze Link</button>
                    </div>
              </div>
          </form>
       <ul id="adze-link-list">{linkItems}</ul>
    </div>
  )
}


export default LinksSection
