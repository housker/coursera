const courses = require('../scrape/algorithm.json');
const keywords = require('./keywords.json');
const { search } = require("fast-fuzzy");
const fs = require('node:fs');

function scoreSites() {
    let scoredSites = [];

    for (let course of courses) {
        let score = 0;
        for (let kw of keywords) {
            let result = search(kw, course.tags, { returnMatchData: true });
            let matchScore = result[0]?.score ?? 0;
            score += matchScore > 0.5 ? 1 : 0;
        }
        scoredSites.push({
            site: course.site,
            score
        })
    }
    
    return scoredSites.sort((a, b) => b.score - a.score);
}

fs.writeFile('scored-sites.json', JSON.stringify(scoreSites()), err => {
  if (err) {
    console.error(err);
  } else {
    console.log('scored-sites created')
  }
});
