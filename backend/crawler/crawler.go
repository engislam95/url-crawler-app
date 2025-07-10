package crawler

import (
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"golang.org/x/net/html"
)

// CrawlResult holds the extracted data
type CrawlResult struct {
    Title          string
    HTMLVersion    string
    Headings       map[string]int
    InternalLinks  int
    ExternalLinks  int
    BrokenLinks    int
    HasLoginForm   bool
}

func Crawl(pageURL string) (CrawlResult, error) {
	res := CrawlResult{
		Headings: make(map[string]int),
	}

	// fetch html
	resp, err := http.Get(pageURL)
	if err != nil {
		return res, fmt.Errorf("failed to fetch URL: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		res.BrokenLinks = 1
		return res, nil
	}

	// parse it
	doc, err := html.Parse(resp.Body)
	if err != nil {
		return res, fmt.Errorf("failed to parse HTML: %v", err)
	}

	// counting
	baseURL, _ := url.Parse(pageURL)
	var f func(*html.Node)
	f = func(n *html.Node) {
		if n.Type == html.ElementNode {
			// Count headings
			if strings.HasPrefix(n.Data, "h") && len(n.Data) == 2 && n.Data[1] >= '1' && n.Data[1] <= '6' {
				res.Headings[strings.ToUpper(n.Data)]++
			}

			// Title tag
			if n.Data == "title" && n.FirstChild != nil {
				res.Title = strings.TrimSpace(n.FirstChild.Data)
			}

			// Check if link
			if n.Data == "a" {
				for _, attr := range n.Attr {
					if attr.Key == "href" {
						link := attr.Val
						u, err := url.Parse(link)
						if err != nil || u.Scheme == "mailto" {
							continue
						}
						full := baseURL.ResolveReference(u).String()
						if strings.HasPrefix(full, baseURL.Scheme+"://"+baseURL.Host) {
							res.InternalLinks++
						} else {
							res.ExternalLinks++
						}
						checkLinkStatus(full, &res)
					}
				}
			}

			// Detect login form
			if n.Data == "input" {
				var isPassword bool
				for _, attr := range n.Attr {
					if attr.Key == "type" && attr.Val == "password" {
						isPassword = true
					}
				}
				if isPassword {
					res.HasLoginForm = true
				}
			}
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			f(c)
		}
	}
	f(doc)

	// Detect HTML version (very basic for now)
	if strings.Contains(resp.Proto, "1.1") {
		res.HTMLVersion = "HTML 4.01 or lower"
	} else {
		res.HTMLVersion = "HTML5"
	}

	return res, nil
}

func checkLinkStatus(link string, res *CrawlResult) {
	resp, err := http.Head(link)
	if err != nil || resp.StatusCode >= 400 {
		res.BrokenLinks++
	}
}
