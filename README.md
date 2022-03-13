# ADZE: Aggressively Decentralized Search Engine
#### Or: ADZE: Asynchronous Digital Sharing Environment

# Reinvent the magic of the web with just the right primtives

In a nutshell, ADZE is a **Relevance Protocol**.



ADZE is a protocol that rides on top of HTTP. Adze peers exchange ineformation about relevance using "Recursive Lists of Rated Links."  Users will store lists of links they have opinions on, at publicly accessible urls. These lists can also include links to other user's lists.   By recursively crawling the lists of rated links, adze peers will be able get a list of high quality links, on their local machine.  Adze peers can choose which other peers they think have good quality, and will get the content of those users' peer lists as well.

A browser plugin is provided, showing how this all fits together.


# What?

Think of it this way: all kinds of sites on the internet follow a pattern like this

A service operator:
* collects some pile of content,  or, in the case of search engines, index the entire web
* shows people stuff from that content that the service operator thinks people will like

But who knows what you like, better than you do? The insight behind ADZE is that 'people with taste that i like' will reliably provide me with better content than some ML algorithm run by some company, which is ultimately tryign to get me to buy stuff, either from them or a third party.

ADZE simply reverses 'collect everything, rank remotely' paradigm. ADZE users:

* 'adze' sites they like, to their list of good links
* publish their list rated links, on the web where others can see it
* 'adze' their friends' published lists
* use a page in their local browser to consume the content of their friends lists, and those friends' lists, and those friend's lists, etc

The 'publishing to the web' and 'downloading your friednds lists' stuff is still a work in progress right now.
