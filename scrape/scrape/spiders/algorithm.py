# scrapy crawl algorithm -O algorithm.json

import scrapy
from .pages import page_urls

class AlgorithmSpider(scrapy.Spider):
    name = "algorithm"
    allowed_domains = ["www.coursera.org"]
    
    def start_requests(self):
        for url in page_urls:
            yield scrapy.Request(url=url, callback=self.parse)
    
    def parse(self, response):
        def extract_with_css(query):
            return [x.strip() for x in response.css(query).getall()]
        
        yield {
            "site": response.url,
            "tags": extract_with_css("#about .cds-142::text") + extract_with_css(".css-o5tswl::text"),
        }
