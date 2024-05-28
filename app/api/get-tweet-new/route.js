import { NextResponse } from 'next/server';
import cheerio from 'cheerio';

export const maxDuration = 60; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';


export async function POST(request) {
    try {
        const { url } = await request.json();
        console.log('URL:', url); // Debug: print the URL

        let tweetText = '';
        let mediaArr;

        // check if the URL is from Twitter or LinkedIn
        if (url && url.includes('twitter') || url.includes('x.com')) { 
                const tweetId = getTweetIdFromUrl(url);
                const twitterData = await fetchTweetTextFromTwitter(tweetId);
                tweetText = twitterData.tweetText;
                mediaArr = twitterData.mediaArr;
        }

        if (url && url.includes('linkedin')) {
                const linkedInData = await fetchFromLinkedIn(url);
                tweetText = linkedInData.tweetText;
                mediaArr = linkedInData.mediaArr;
                
        }

        return NextResponse.json({ text: tweetText, media: mediaArr });
    } catch (error) {
        console.error('Error fetching tweet text:', error);
        return NextResponse.json({ error: 'Error fetching tweet text' }, { status: 500 });
    }
}


function getTweetIdFromUrl(url) {
    url = url.split('?')[0];
    const tweetId = url.split('/').pop().trim();
    console.log('tweetID: ', tweetId)
    return tweetId;
}

async function fetchTweetTextFromTwitter(tweetId) {
    try {

        const url = `https://twitter.com/i/api/graphql/bFUhQzgl9zjo-teD0pAQZw/TweetDetail?variables=${encodeURIComponent(JSON.stringify({
                focalTweetId: tweetId,
                with_rux_injections: false,
                includePromotedContent: true,
                withCommunity: true,
                withQuickPromoteEligibilityTweetFields: true,
                withBirdwatchNotes: true,
                withVoice: true,
                withV2Timeline: true
            }))}&features=${encodeURIComponent(JSON.stringify({
                rweb_tipjar_consumption_enabled: true,
                responsive_web_graphql_exclude_directive_enabled: true,
                verified_phone_label_enabled: false,
                creator_subscriptions_tweet_preview_api_enabled: true,
                responsive_web_graphql_timeline_navigation_enabled: true,
                responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
                communities_web_enable_tweet_community_results_fetch: true,
                c9s_tweet_anatomy_moderator_badge_enabled: true,
                articles_preview_enabled: true,
                tweetypie_unmention_optimization_enabled: true,
                responsive_web_edit_tweet_api_enabled: true,
                graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
                view_counts_everywhere_api_enabled: true,
                longform_notetweets_consumption_enabled: true,
                responsive_web_twitter_article_tweet_consumption_enabled: true,
                tweet_awards_web_tipping_enabled: false,
                creator_subscriptions_quote_tweet_preview_enabled: false,
                freedom_of_speech_not_reach_fetch_enabled: true,
                standardized_nudges_misinfo: true,
                tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
                rweb_video_timestamps_enabled: true,
                longform_notetweets_rich_text_read_enabled: true,
                longform_notetweets_inline_media_enabled: true,
                responsive_web_enhance_cards_enabled: false
            }))}&fieldToggles=${encodeURIComponent(JSON.stringify({
                withArticleRichContentState: true,
                withArticlePlainText: false,
                withGrokAnalyze: false
            }))}`;

        const response = await fetch(url, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7,az;q=0.6",
            "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
            "content-type": "application/json",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-client-transaction-id": "vdZkJoVqLVEaQ3W33k4JWmk4IYLxbuWXEiiy2NkYhJdMk/P50X9KzBaNH2LaQQwkbZkQvL+OYZxV6vTcvkYdvYUx6Jjqvg",
            "x-client-uuid": "f39c33a6-7914-4c5e-a7a9-d3372ce3f9f2",
            "x-csrf-token": "8413acb0e657cd88a4d440fc93875c9c85810ca87ec76ab0d95e4fa364413e9a4a455148d448ec0b6de2f6253f61a11cfbee21f3109a5cbe8d69e709bc6bf72783df313a6066b1db3aa0579f2f831a1e",
            "x-twitter-active-user": "yes",
            "x-twitter-auth-type": "OAuth2Session",
            "x-twitter-client-language": "en",
            "cookie": "guest_id_marketing=v1%3A171051564250042502; guest_id_ads=v1%3A171051564250042502; guest_id=v1%3A171051564250042502; _ga=GA1.2.1697540668.1710800266; kdt=uioDcCVDnybg0FgYs0JRsLDJKvupS2DR2v20mKtS; auth_token=61e2c70932424f3cef7f12978ba2a4dc5b59baaf; ct0=8413acb0e657cd88a4d440fc93875c9c85810ca87ec76ab0d95e4fa364413e9a4a455148d448ec0b6de2f6253f61a11cfbee21f3109a5cbe8d69e709bc6bf72783df313a6066b1db3aa0579f2f831a1e; twid=u%3D18443829; external_referer=8e8t2xd8A2w%3D|0|F8C7rVpldvGNltGxuH%2ByoRY%2FzjrflHIZH061f%2B5OiIwP17ZTz34ZGg%3D%3D; lang=en; personalization_id=\"v1_2NyWMzSU6PIW85wAoG407w==\"",
            "Referer": "https://twitter.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
        });

        const responseJSON = await response.json();

        let tweetText = '';
        if (responseJSON.data.threaded_conversation_with_injections_v2.instructions[0].entries[0].content.itemContent.tweet_results.result.note_tweet) {
            tweetText = responseJSON.data.threaded_conversation_with_injections_v2.instructions[0].entries[0].content.itemContent.tweet_results.result.note_tweet.note_tweet_results.result.text;
        } else {
            tweetText = responseJSON.data.threaded_conversation_with_injections_v2.instructions[0].entries[0].content.itemContent.tweet_results.result.legacy.full_text;
        }
        const media = responseJSON.data.threaded_conversation_with_injections_v2.instructions[0].entries[0].content.itemContent.tweet_results.result.legacy.entities.media;
        // // const node = responseJSON.data.find(element => element.media_url_https !== undefined);
        // // console.log('Node:', node);

        // if ( media === undefined ){
        //     console.log('No media found');
        //     const card = responseJSON.data.threaded_conversation_with_injections_v2.instructions[0].entries[0].content.itemContent.tweet_results.result.card.legacy.binding_values[0].value.string_value;
        //     const cardArr = JSON.parse(card);
        //     console.log(cardArr.media_entities)
        // } else {
        //     console.log('Media:', media);
        // }
       

        // get media_url_https and type from media array
        if (!media) {
            return { tweetText, mediaArr: [] };
        }

        const mediaArr = media.map((media) => {
            return {
                media_url_https: media.media_url_https,
                type: media.type
            }
        });
       
        return { tweetText, mediaArr };
    } catch (error) {
        console.error('Error fetching tweet text:', error);
        throw error;  
    }
}

async function fetchFromLinkedIn(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        
        const $ = cheerio.load(text);
    
        const tweetText = $('.main-feed-activity-card p.attributed-text-segment-list__content').text();

        // const mainImage = $('article img.w-main-feed-card-media');
        // console.log('Main Image:', mainImage[0].attribs.src);

        return { tweetText, mediaArr: [] };

        // if (mainImage) {
        //     return { tweetText, mediaArr: [] };
        
        // } else {
        //     return { tweetText, mediaArr: [] };
        // }
        
    } catch (error) {
        console.error('Error fetching LinkedIn text:', error);
        throw error;
    }
}   