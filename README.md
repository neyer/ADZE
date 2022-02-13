# ADZE: Aggressively Decentralized Search Engine


ADZE is a design architecture for a global decentralized search engine.  It intends to solve similar problems as commercial search engines, but without any large company controlling the system. Businesses will participate on the ADZE network, but they will do so as competing participants in an** ecosystem of digital sovereigns.**

The internet is currently powered by ads. We want to replace ad-powered networks with the ADZE network, in part so that future users of the web will remember what was almost lost. 


## Why? Search Algorithms Encode Moralities

Every search algorithm needs to decide which results are relevant, and which results are not. Search algorithms make this choice via _ranking_, which means applying a value system to every entry in the set of possibly relevant results. 

The use of some value system raises an important question: **what value system should determine which results are relevant, and which results are not?**

Even though it applies only to documents, any ranking system is a _moral_ system. A ranking system says what is good and what is bad. Moral values are _deeply personal choices._ It bears repeating that there is no universally-held-as-correct value system. People disagree _deeply_ over what is and isn’t a relevant document.  **Centralized search engines violate the fundamental ethos of the web**. They risk **eliminating the possibility of diverse perspectives** by positing one ostensibly-true answer as to what is relevant. We should not have a small number of massive corporations making decisions for everyone based upon value systems which attempt to maximize their own profit. We deserve better.

The ADZE ethos is that **individual users should be empowered** to search the web according to **their _own_ personal values system**.  To this end, we believe that **the web can only remain decentralized if ranking is done locally.**


## What?  Personalized Search

ADZE delivers **personalized results for you**, based upon your own selection of ranking criteria.  Personalization for you should not happen due to some third party modifying rows in a database that represent their image of you. **You should have the ability to express your own values** _explicitly_ in code that you control, and implicitly in the datasets that your ranking algorithms train on.

Yes, **this is likely going to be much too complex for most users**. If you cannot write code or reason about ML systems, then you are forced to rely upon people who can, **and you should have the freedom to decide who you trust,** and whose results you can ignore. 

ADZE users will interact with local ranking engines that decide which results their owners are likely to find relevant, by algorithmically deciding:



* **which remote indices they will consult**, and 
* **how to combine and rank the results from multiple indices** into locally visible results

The ADZE network will consist of a very large number of different actors with different values. Anyone will be able to freely join the ADZE network. ADZE businesses will compete for traffic by delivering better value in some niche, by building a better index to serve that _specific_ niche.



* For example, we might see local search engines which build great indices of results, but those indices are only value for some geographical area. A geographical metaindex might combine these local indices together.

* A fan of jazz might build their own extremely detailed index for jazz-related searches, and they might cooperate with other jazz fans to make this great.  But some people love Coltrane and others think Miles Davis is the best.   A jazz metaindex might combine multiple jazz indices togehter.

Crushing all indices into one index to rule them all robs us of the true benefits of diversity: we aren’t going to agree, and that’s OK! ADZE maintains very large numbers of separate indices and encourages the creation of specialized indices.


## How? Large Numbers of Local Crawlers + Indexers


The ADZE network will consist of nodes which run:


* A local** HTTP proxy server** which stores copies of all documents that pass through it. These documents will be stored in a **document history. **This proxy server takes the place of **centralized crawlers**. By recording which links a user _actually_ clicked, **ADZE can use better signals of relevance** than mindless bots which follow all links equally.
* A local **indexing server** which builds indices of all stored documents. 
* A local **ranking server **which encodes the **users’ personal values**, both** filtering irrelevant results during indexing**, and **combining the results of multiple indices **for user’s searches
* A local **query server **would handle user search requests, by combining results from the **local index, **plus a list of remote indices

**Every single component of this system must be open source and interchangeable.  **If people can’t swap these components out according to their own values, then the vision of a free, open web is lost.

Users should be able to mix local proxy servers, rankers, and indexers. Yes, this is likely going to be much too complicated for most people to do.  **It is likely the case that digital sovereigns will run these nodes on behalf of their friends, family, and loved ones.**  At present, most of us rely on large companies to act as our digital sovereigns. **The ADZE network wishes to empower digital sovereigns at all scales**.

Users will modify their ranking algorithms to weed out indices run by people they dont trust, and consciously boost up indices for people they do trust. Some users will run indices _of other indices_. These **metaindices **will act like index aggregators. They will _also _compete to provide the best services.  This likely means competing in niches; Christians will likely have multiple christian metaindices; there will be mulsim metaindices and vegan metaindices and paleo-crossfit-cryogenics enthusiast metaindices as well.   
 
**Anyone will be able to compete to offer better results in any category **simply by building their own index and then attempting to gain the trust of other users.  Certain ADZE businesses might not use the HTTP proxy model at all, and instead use things like manually curated lists for better results.

**Local combination of multiple indices allows for aggressive competition**: the local ranking algorithms can learn from my reponses (my local ranker will track results I picked, and learn to predict my choice in advance) and learn to favor one search engine over another based upon context, the type of result, etc. 

Additionally, I can tell my local ranking engine “this site sucks, I don't want you to suggest it again.” If I spend long hours at some website  because it frightens and angers me, the existing ranking engines prioritize it because it looks like engagement.  ADZE allows me to say ‘this source is awful and it should be removed from my life.  



## Base Layer + Incentives 

ADZE should be able to operate nicely on top of the bitcoin lightning network, if users wish to reward the creators and owners of powerful indices by paying them for index results. In order to prevent DDoS attacks, an ADZE node operator might serve traffic only to requests from a limited number of connected lightning channels, in exchange for nominal fees. The fees fund the operation of the ADZE nodes, as well as prevent DDoS attacks. 

Of course, this, too, should be an option - the philosophy of the web is that everyone is the master of their own moral values, and **everyone should be sovereign inside their own heads.** Computers, as external extensions of our brains, _must _give users maximal flexibility to express their own values in code and in data, or else they become tools of distributed slavery and decentralized tyranny.

For users unconnected to lightning, It’s likely the case that **simply owning a great index **will drive lots of traffic to the owner of that index. An index owner might choose to accept payment for boosting results, but would do so at the peril of losing reputation.  The local ranking means i can easily add new competitors for an index - even without my knowing these new competitors exist! - because their presence in metaindices that I trust will make their results show up locally.  If I pick a new competitor’s results more often, my own internal ranking engine will learn _my _preference for these new competitors. 


This** means every single aspect of the ADZE stack** can, and will be, the **subject of intense decentralized competition **to build the best component, for users of a particular niche.   **The only shared vision that will unite users of the ADZE network** is that **people must be free to choose their own way.**


## How to crack the network first mover problem?

Why run an ADZE node if nobody else does?

**Because searching through your own browser’s history is a terrible experience.**  You can generally only search by title. By running all your browsing activity through a proxy which stores copies of all retrieved documents, you can **begin to search your own browsing history using full text search.**

[webcorder tools](https://webrecorder.net/tools)  already exists, but storage space for local users may be a concern. The only thing ADZE needs to store is just the text of web pages, so that they can be indexed.

## How do I use this?

So far this is just an idea. I’ll post links to implementations here as I get started on them. There could be many different implementations, and i’ll link to any that i’m aware of, as they are created. 
