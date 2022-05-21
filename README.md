# ADZE: Aggressively Decentralized Search Engine
#### Or: ADZE: Asynchronous Digital Sharing Environment

# Reinvent the magic of the web with just the right primtives

In a nutshell, adze is a **Recommendation Protocol**.

Adze (sounds like 'ads') is a protocol that rides on top of HTTP. Adze peers exchange information about quality content, using "recursive lists of rated links."  Users will store lists of links they have opinions on, at publicly accessible urls. These lists can also include links to other peer's adze lists.   By recursively crawling the lists of rated links, adze peers will be able get a list of high quality links, on their local machine.  Adze peers can choose which other peers they think have good quality links, and will get the content of those users' peer lists as well.

The result is something like an easily hackable, totally decentralized link-sharing network, which, in the limit of many many people using adze, could evolve into a decentralized search engine.

See [the website](https://www.adze.network/) for more details.

# Development
Most of the work is now happening in `adze-web` which is based on react and redux.  Use `npm start` in `adze-web` folder to get it running.

The project started as a plugin but that turned out to be too inflexible and difficult for most people to set up.

Two [fake](https://gist.githubusercontent.com/neyer/f3c5f91f0d88ae8ca727d8603a3d8065/raw/1ae11a5502a5403f3275d2d55be82a99ad159a21/knife-manifest) [manifests](https://gist.githubusercontent.com/neyer/721c7dfd2aba2d0e9efe1bad26e32917/raw/a7027ed7236e9218978655281e33d4dd95545525/fork-manifest) can help in development.   Add these two urls as 'peers' and then your feed will have some recommended links.


# How do I use this?
The goal is to make create a network of recommendations signals, exchanged among peers who trust each other, so that we can eventually index everything worth indexing on the web. As new links are added by peers, they'll show up in your feed. We are in the stage of 'seeding the network' right now.  Think of yourself as an early pioneer in what may be a very exciting future of the web. Make the web weird again!
