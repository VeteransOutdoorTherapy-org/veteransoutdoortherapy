import { NextResponse } from "next/server";

/**
 * Turns away crawlers that bring the site nothing — SEO-tool scrapers, data and
 * image harvesters, foreign search engines, bare HTTP libraries, headless
 * browsers — so they cost no page renders, database reads, or image transfer.
 *
 * The user-agent test lives in the matcher, which Vercel checks at the edge
 * before anything runs: ordinary visitors never invoke this proxy at all, and a
 * blocked bot gets an empty 403. Because it covers every path but /api, a bot
 * that is refused the HTML also never learns the image URLs.
 *
 * Deliberately NOT listed, because search rankings and AI answers depend on
 * them: Googlebot and the other Google agents, bingbot, Applebot, DuckDuckBot,
 * GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User,
 * PerplexityBot, Perplexity-User, Amazonbot, CCBot, and the link-preview agents
 * (facebookexternalhit, meta-externalagent, Twitterbot, LinkedInBot, Slackbot,
 * Discordbot, WhatsApp) that draw a card when someone shares a page.
 *
 * The matcher must be a literal for Next to read it at build time, so the list
 * is written out here. Next wraps it as ^…$ and matches case-sensitively, hence
 * the leading and trailing .* and the exact spelling of each token.
 */
export function proxy() {
	return new NextResponse(null, { status: 403 });
}

export const config = {
	matcher: [
		{
			source: "/((?!api/).*)",
			has: [
				{
					type: "header",
					key: "user-agent",
					// SEO and marketing tools; search engines with no US audience and TikTok's crawler;
					// data and image harvesters and vulnerability scanners; HTTP libraries and headless browsers.
					value:
						".*(?:AhrefsBot|AhrefsSiteAudit|SemrushBot|SiteAuditBot|MJ12bot|DotBot|BLEXBot|DataForSeoBot|serpstatbot|SeekportBot|Barkrowler|MegaIndex|rogerbot|Screaming Frog|SEOkicks|ZoominfoBot|Siteimprove|linkdexbot|SenutoBot|Bytespider|PetalBot|Baiduspider|Sogou|YandexBot|YandexImages|Yeti/|SeznamBot|Mail\\.RU_Bot|coccocbot|ImagesiftBot|Diffbot|omgili|Timpibot|VelenPublicWebCrawler|magpie-crawler|Scrapy|ISSCyberRiskCrawler|Nuclei|zgrab|CensysInspect|Expanse|InternetMeasurement|python-requests|Python-urllib|python-urllib|aiohttp|python-httpx|Go-http-client|okhttp|Java/|Apache-HttpClient|libwww-perl|Wget|curl/|node-fetch|axios/|GuzzleHttp|HeadlessChrome|PhantomJS|colly).*",
				},
			],
		},
		// Every real browser sends a user agent; a request without one is a script.
		{ source: "/((?!api/).*)", missing: [{ type: "header", key: "user-agent" }] },
	],
};
