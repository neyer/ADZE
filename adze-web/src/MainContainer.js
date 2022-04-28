import React from 'react'

import FeedSection from './FeedSection.js'
import LinksSection from './LinksSection.js'
import PeersSection from './PeersSection.js'
import ConfigureSection  from './ConfigureSection.js'

import ADZE from './Backend.js'

const INVISIBLE_STYLE = {height: '0px', padding: '0px'};


class MainContainer extends React.Component {

  constructor(props) {
    super(props);
  this.state = {manifest: ADZE.makeNewManifest() }
  }

  render () {
    return (
      <section className="section">
        <div className="container">
          <p className="title">Adze Recommendation Protocol</p>
          <TabSelector manifest={this.state.manifest}/>
        </div>
      </section>
    );
  }
}


class TabSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentTab: 'feed' };
  }

  getClassForTabSelector(tabName) {
      return tabName === this.state.currentTab ? "is-active" : "";
  }

  setTab(tabName) {
    this.setState({
      currentTab: tabName
    });
  }
   
  render() {
    
      const inactiveStyle = { height:'0px', padding:'0px' };
  
   
      return  (
      <div>
        <div className="tabs is-medium is-centered">
            <ul>
              <li className={this.getClassForTabSelector("feed")}  id="btn-select-tab-feed"> <a onClick={() => this.setTab("feed")}>feed</a></li>
              <li className={this.getClassForTabSelector("links")} id="btn-select-tab-links"><a onClick={() => this.setTab("links")}>my links</a></li>
              <li className={this.getClassForTabSelector("peers")} id="btn-select-tab-peers"><a onClick={() => this.setTab("peers")}>my peers</a></li>
              <li className={this.getClassForTabSelector("setup")} id="btn-select-tab-setup"><a onClick={() => this.setTab("setup")}>setup</a></li>
             </ul>
        </div>
        <FeedSection  isActive={this.state.currentTab == "feed"} />
        <LinksSection isActive={this.state.currentTab == "links"} />
        <PeersSection isActive={this.state.currentTab == "peers"} />
        <ConfigureSection isActive={this.state.currentTab == "setup"} />
      </div>
     )
  }

}

export default MainContainer

