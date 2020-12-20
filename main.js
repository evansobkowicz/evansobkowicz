// ©2020 EvanSobkowicz.com

const TimelineElement = document.getElementById('timeline');
const TweetsElement = document.getElementById('tweets');
const TweetsLoadingElement = document.getElementById('tweets-loading');

const TimelineOpts = {
  chrome: 'noheader nofooter noborders transparent noscrollbar',
  dnt: true,
  height: 10,
  showReplies: false,
  tweetLimit: 20
};

const TweetOpts = { align: 'center', conversation: 'none', dnt: true }

const limit = 6;
const screenName = 'evansobkowicz';

const isTimelineEvent = event => event.target.title === 'Twitter Timeline';

twttr.ready(twttr => {
  twttr.widgets.createTimeline({ sourceType: 'profile', screenName }, TimelineElement, TimelineOpts);
  twttr.events.bind('rendered', event => {
    if (!isTimelineEvent(event)) { return; }
    const tweetEls = event.target.contentDocument && event.target.contentDocument.querySelectorAll('.timeline-Tweet');
    const nonRetweetEls = Array.from(tweetEls).filter(el => el.dataset.tweetId === el.dataset.renderedTweetId);
    const tweetIds = nonRetweetEls.slice(0, limit).map(el => el.dataset.tweetId);
    const tweets = tweetIds.map(id => twttr.widgets.createTweet(id, TweetsElement, TweetOpts));
    Promise.resolve(tweets[0]).then(() => TweetsLoadingElement.remove());
  });
});

const YearElement = document.getElementById('year');
const date = new Date();
YearElement.innerText = date.getFullYear();
