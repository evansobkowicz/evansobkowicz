// ©2020 EvanSobkowicz.com

const TimelineElement = document.getElementById('timeline');
const TweetsElement = document.getElementById('tweets');
const TweetsLoadingElement = document.getElementById('tweets-loading');
const MainElement = document.getElementById('main');
const MetaElement = document.getElementById('meta');

const TimelineOpts = {
  chrome: 'noheader nofooter noborders transparent noscrollbar',
  dnt: true,
  height: 10,
  showReplies: false,
  tweetLimit: 20
};

const TweetOpts = { align: 'center', conversation: 'none', dnt: true };

const limit = 6;
const screenName = 'evansobkowicz';
const includeRTs = false;

const logTweetStatus = (success) => ga && ga('send', 'event', 'Tweets', success ? 'success' : 'failure');

const isTimelineEvent = ({ title }) => title === 'Twitter Timeline';
const isOriginalTweet = ({ dataset: { renderedTweetId, tweetId } }) => renderedTweetId === tweetId;

twttr.ready(twttr => {
  twttr.widgets.createTimeline({ sourceType: 'profile', screenName }, TimelineElement, TimelineOpts);
  twttr.events.bind('rendered', ({ target }) => {
    if (!isTimelineEvent(target)) { return; }
    const tweetEls = Array.from(target.contentDocument && target.contentDocument.querySelectorAll('.timeline-Tweet'));
    const filteredEls = includeRTs ? tweetEls : tweetEls.filter(isOriginalTweet);
    const tweetIds = filteredEls.slice(0, limit).map(el => el.dataset.tweetId);
    const tweets = tweetIds.map(id => twttr.widgets.createTweet(id, TweetsElement, TweetOpts));
    Promise.all(tweets).then(() => {
      TweetsLoadingElement.remove();
      MetaElement.style = '';
      MainElement.appendChild(MetaElement);
      logTweetStatus(true);
    }).catch(() => {
      logTweetStatus(false);
    });
  });
});

const YearElement = document.getElementById('year');
const date = new Date();
YearElement.innerText = date.getFullYear();
