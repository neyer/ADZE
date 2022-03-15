# ADZE: Aggressively Decentralized Search Engine
#### Or: ADZE: Asynchronous Digital Sharing Environment

# Reinvent the magic of the web with just the right primtives

In a nutshell, adze is a **Relevance Protocol**.

Adze (sounds like 'ads') is a protocol that rides on top of HTTP. Adze peers exchange information about quality content, using "recursive lists of Rated links."  Users will store lists of links they have opinions on, at publicly accessible urls. These lists can also include links to other peer's adze lists.   By recursively crawling the lists of rated links, adze peers will be able get a list of high quality links, on their local machine.  Adze peers can choose which other peers they think have good quality, and will get the content of those users' peer lists as well.

The result is something like an easily hackable, totally decentralized link-sharing network, which, in the limit of many many people using adze, could evolve into a decentralized search engine.

Instead of one monster index for the whole internet, owned by a giant corporation for make great sharehodler value, the adze vision is millions of peers constructing their own tiny indices of content they personally like, with peers finding each other through recursively. If you wanted to find a great camera in real life, before search engines were a thing, you might have asked a friend who's really into photography for a recommendation. They, in turn, might consult their networ. Adze recaptures this formula, but for the web. 

This is the first step in a much broader vision, of a distributed 'sensemaking apparatus' that dramatically lowers the cost for collaborative sense making, using identity as a bullshit filter. If someone starts being spammy in adze, all you have to do is drop them from your peers list. Better yet, you might adze them to a 'spammy peers' list, so that your friends don't have to deal with their nonsense either. 

A browser plugin is in this repo, showing how this all fits together. It runs on chrome and brave browsers.

# What?

Think of it this way: all kinds of sites on the internet follow a pattern like this

A service operator:
* collects some pile of content,  or, in the case of search engines, indexes the entire web
* shows people stuff from that content that the service operator thinks people will like, based upon either their identity or some search terms

But who knows what you like, better than you do? The insight behind ADZE is that 'people with taste that i like' will reliably provide me with better content than some ML algorithm run by some company, which is ultimately trying to get me to buy stuff, either from them or a third party.

Adze reverses the 'collect everything, rank remotely' paradigm. ADZE users share only _good_ content they find, with their networks. Good content can be direct links to other content, but it can also be 'adze peers with good content'. 

The process works like this. Each adze use will:

* 'adze' sites they like, to their list of good links
* publish their list rated links, on the web where others can see it
* 'adze' their friends' published lists
* use a page in their local browser to consume the content of their friends lists, and those friends' lists, and those friend's lists, etc

The  'downloading your friednds lists' stuff is still a work in progress right now.
