const fs = require('fs');
const { SitemapStream, createSitemapsAndIndex } = require('sitemap')

const _event = require('../models/event');
const _venue = require('../models/venue');

const sitemapper = async () => {

    const sitemap = new SitemapStream({hostname: 'https://concert.moscow'});
    const events = await _event.find({date: {$gt: new Date()}}).catch(e => e) || [];
    const venues = await _venue.find().catch(e => e) || [];
    const vurls = venues
        .map(venue => {
            // console.log(venues);
            return {
                url: 'https://concert.moscow/' + venue.alias,
                loc: 'https://concert.moscow/' + venue.alias,
                lastmod: new Date(venue.updatedAt).toISOString(),
                priority: 0.7,
                changefreq: 'daily',
            };
        });
    const eurls = events
        .map(event => {
            // console.log(venues);
            return {
                url: `https://concert.moscow/concert/${event.alias || event.uuid}`,
                loc: `https://concert.moscow/concert/${event.alias || event.uuid}`,
                lastmod: new Date(event.updatedAt).toISOString(),
                priority: event.ssr && 0.9 || (event.min_price > 2000) && 0.8 || (event.category.includes('Рок')) && 0.7|| 0.5,
                changefreq: 'weekly',
            };
        });
    const customs = [{
        href: '/rock',
    },{
        href: '/rap',
    },{
        href: '/electro',
    },{
        href: '/top',
    },{
        href: '/pop',
    }];
    const urls = [...eurls, ...vurls, customs.map(c => {return {
        url: `https://concert.moscow${c.href}`,
        loc: `https://concert.moscow${c.href}`,
        lastmod: new Date().toISOString(),
        priority: 1,
        changefreq: 'daily',
    }})];
    createSitemapsAndIndex({
        hostname: 'https://concert.moscow',
        sitemapName: 'sitemap',
        sitemapSize: 500,
        targetFolder: '../front/public',
        urls,
        gzip: false
    }).then(() => require('../libs/mongoose').disconnect());
};

module.exports = sitemapper;
if (!module.parent) {
    sitemapper();
}
