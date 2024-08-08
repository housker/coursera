# Coursera

Ranks Coursera courses on similarity to ICS 311

## File structure

There are two input files, _scrape/algorithm.json_ and _match/keywords.json_ which _match/index.js_ matches against each other and ranks in _match/scored-sites.json_.

## Scrape

Note: most of _coursera/scrape/_ is boilerplate generated from [Scrapy's CLI tools](https://docs.scrapy.org/en/latest/topics/commands.html). Only _pages.py_ and _algorithm.py_ are hand coded.

_pages.py_ is the list of course description urls _algorithm.py_ scrapes for tags. It was obtained by [searching for "algorithms"](https://www.coursera.org/search?query=algorithms&language=English&sortBy=BEST_MATCH) (1,006 results at the time of writing) and running `copy(Array.from(document.querySelectorAll('[data-track-component="search_card"]')).map(x=>x.href))` in the browser console.

The spider writes those tags to file (_algorithm.json_) with the following command run from the Scrapy project root directory (_coursera/scrape_)
```
scrapy crawl algorithm -O algorithm.json
```

## Match
Keywords from ICS 311's [topics](https://ics311.github.io/) and [schedule](https://ics311.github.io/schedule.html) are copy-pasted into _keywords.json_. Using [Fast-fuzzy](https://github.com/EthanRutherford/fast-fuzzy#readme), _index.js_ runs through each of those keywords and checks how many of each courses' tag match. After running `npm i`, you can execute by running `npm start` from the root directory of that project (_coursera/match_). The result is _scored-sites.json_ which gives us what we're ultimately after: a ranked ordering of Coursera courses based on similarity to ICS 311.

## Shortcomings
- Scraping the tags for coursera class descriptions didn't capture some of the information conveyed in paragraphs, but given that those descriptions weren't as detailed as the syllabus to begin with, the approximation they provided could at least be valuable in narrowing down the choices.
- On a practical level, there are some problems with matching up the keywords from the scraped data with those of the syllabus:
  - for phrases, search each word individually?
  - plural/singular?
  - capitalization?
  - for variations (complete/completeness), fuzzy?
  - for "&" search "and"? (There were only 2 &'s in the scraped data; changed them to and)
  - search acronyms (binary search tree BST)?
- Fuzzy matching was a good response to the issues above, except the last, and as for variations in the quality of the library itself, Fast-fuzzy was [well-reviewed](https://x.com/diegohaz/status/1561036326849372163?lang=en) and only has one open Github issue.
- My initial two (first with `fuzzy` then `search`) attempts at matching iterated through each of the coursera tags and checked if they matched the syllabus keywords, but that resulted in higher scores for redundancy. (A course with 5 tags that just said "algorithms" would score higher.) Switching that to iterate through the keywords, and giving a binary 1 or 0 for match/no-match, the score is then instead based on what percentage of ICS 311 keywords show up in a given Coursera course's tags, which lends a more accurate outcome.