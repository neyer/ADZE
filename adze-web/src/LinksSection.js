import React, { useState } from 'react'
import Constants from './Constants.js'
import { selectManifest, addLinkByUrl, removeLink } from './state/manifestSlice.js'
import { selectCredentials } from './state/credentialsSlice.js'
import { useSelector, useDispatch } from 'react-redux'
import { ErrorMessageOrNull, ManifestStatusMessage } from './notifications.js'

const numberOfTags = 4;


function SingleLinkElement({ link }) {
  // upvote adze it to your own list of links
  // gives you the option of following the peer if you aren't already
  // downvote removes it from your feed, adze it to your list of 'no good'
  // links, and gives the option of removing that peer

  const dispatch = useDispatch();

  const removeThisLink = () => {
    dispatch(removeLink(link));
  }

  return (
    <li className='mb-1 box'>
      <button class="button is-danger is-small is-light" onClick={removeThisLink}>Remove &#x274C; </button>
      <span>{link.title}</span>
      <div className='mb-2'><a href={link.url}> {link.url}</a></div>
      <span>Tags: </span>
      {link.tags && link.tags.length !== 0 && link.tags.map(tag => (
        <span class="tag is-info is-light mr-2">
          {tag}
        </span>
      ))}
    </li>
  );
}

function LinksSection({ isActive }) {
  const [inputLinkUrl, setInputLinkUrl] = useState("")
  const [inputTags, setInputTags] = useState([...Array(numberOfTags)])
  const className = isActive ? "" : "is-invisible";
  const styleType = isActive ? {} : Constants.invisibleStyle;
  const manifest = useSelector(selectManifest);
  const credentials = useSelector(selectCredentials);
  const dispatch = useDispatch();

  const linkItems = manifest.content.sites.map(site => <SingleLinkElement key={site.url} link={site} />);

  const handleClear = () => {
    setInputLinkUrl("");
    setInputTags([...Array(numberOfTags)]);
  }

  const updateInputTags = (value, i) => {
    let updateInputTags = [...inputTags];
    updateInputTags[i] = value;
    setInputTags(updateInputTags);
  }

  const handleAddLink = (event) => {
    event.preventDefault();
    console.log(inputLinkUrl);
    let listOfTags = inputTags.filter(e => e && String(e).trim());
    console.log(listOfTags)
    dispatch(addLinkByUrl({
      credentials: credentials,
      link: inputLinkUrl,
      tags: listOfTags
    }));
  }


  return (
    <div className={className} id="section-links" style={styleType}>
      <ManifestStatusMessage credentials={credentials} />
      <h2 className="title is-2">Adzed Links</h2>
      <h3 className="subtitle is-3 mt-4">Add new links:</h3>
      <form onSubmit={handleAddLink}>
        <div className="field">
          <label class="label">Put links to good content here:</label>
          <div className="control is-expanded">
            <input required label="Link:" className="input" type="text" value={inputLinkUrl} onChange={e => setInputLinkUrl(e.target.value)} placeholder="www.mozilla.org"></input>
          </div>
        </div>
        <label class="label">Add tags to describe the link: </label>
        <div class="field is-grouped is-grouped-multiline">
          <p class="control">
            <input className="input" type="text" value={inputTags[0]} onChange={e => updateInputTags(e.target.value, 0)} placeholder="Interesting"></input>
          </p>
          <p class="control">
            <input className="input" type="text" value={inputTags[1]} onChange={e => updateInputTags(e.target.value, 1)}></input>
          </p>
          <p class="control">
            <input className="input" type="text" value={inputTags[2]} onChange={e => updateInputTags(e.target.value, 2)}></input>
          </p>
          <p class="control">
            <input className="input" type="text" value={inputTags[3]} onChange={e => updateInputTags(e.target.value, 3)}></input>
          </p>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button
              className="button is-primary"
              type="submit"
              id="btn-add-link">Adze Link</button>
          </div>
          <div className="control">
            <button
              className="button"
              onClick={handleClear}
              id="btn-clear">Clear</button>
          </div>
        </div>
      </form>

      <div>
        <h3 className="subtitle is-3 mt-6 mb-3">Links you are recommending:</h3>
      </div>
      <ul id="adze-link-list">{linkItems}</ul>
    </div>
  )
}


export default LinksSection
