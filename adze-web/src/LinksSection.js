import React from 'react'


import Constants from './Constants.js'

import { selectManifest } from './state/manifestSlice.js'
import { useSelector, useDispatch} from 'react-redux'


class SingleLinkElement extends React.Component {
   // upvote adze it to your own list of links
  // gives you the option of following the peer if you aren't already
   // downvote removes it from your feed, adze it to your list of 'no good'
  // links, and gives the option of removing that peer

  render() {
    const { link } = this.props;
    return (
        <li>
               <div className="columns">
          <div className="column is-two-fifths">
            <a href={link.url}> {link.title}</a>
          </div>
           <div className="column is-two-fifths area-provenance-details">
             TODO: provenance details
           </div>
           <div className="column">(feedback will go here)</div>
        </div>
      </li>
    );
  }
}

function LinksSection({isActive}) {
  const className = isActive ?  "" : "is-invisible";
  const styleType = isActive ? {} : Constants.invisibleStyle;
  const  manifest = useSelector(selectManifest);

  console.log("ho ho ho");
  console.log(manifest);
  const linkItems = manifest.content.sites.map(site => <SingleLinkElement link={site} />);
  //const linkItems = [];
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
             <ul id="adze-link-list">{linkItems}</ul>
       </div>
  )
}


export default LinksSection
