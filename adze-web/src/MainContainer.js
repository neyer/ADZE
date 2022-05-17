import React from 'react'


import FeedSection from './FeedSection.js'
import LinksSection from './LinksSection.js'
import PeersSection from './PeersSection.js'
import ConfigureSection  from './ConfigureSection.js'

import ADZE from './Backend.js'


function MainContainer (){
        return (
      <section className="section">
        <div className="container">
          <p className="title">Adze Recommendation Protocol</p>
          <TabSelector />
        </div>
      </section>
    );
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
        <FeedSection  isActive={this.state.currentTab === "feed"} mainfest={this.state.manifest} />
        <LinksSection isActive={this.state.currentTab === "links"} mainfest={this.state.manifest} />
        <PeersSection isActive={this.state.currentTab === "peers"} mainfest={this.state.manifest} />
        <ConfigureSection isActive={this.state.currentTab === "setup"} mainfest={this.state.manifest} />
<footer className="footer">
  <div className="content has-text-centered">
    <p>
      <strong>ADZE</strong> by <a href="https://apxhard.com">Mark Neyer</a>. The source code is licensed
      <a href="http://opensource.org/licenses/mit-license.php"> MIT</a>. Made with <span>&#x1F497;</span> in Ohio.
    </p>
  </div>
</footer>

      </div>
     )
  }

}

export default MainContainer

