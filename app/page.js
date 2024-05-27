'use client';
import { useState, useEffect } from 'react';
// import TweetFetcher from '@/components/TweetFetcher';
// import ArticleGenerator from '@/components/ArticleGenerator';
// import ArticleDisplay from '@/components/ArticleDisplay';
// import ArticlePublished from '@/components/ArticlePublished';

import dynamic from 'next/dynamic';

const TweetFetcher = dynamic(() => import('@/components/TweetFetcher'), { ssr: false });
const ArticleGenerator = dynamic(() => import('@/components/ArticleGenerator'), { ssr: false });
const ArticleDisplay = dynamic(() => import('@/components/ArticleDisplay'), { ssr: false });
const ArticlePublished = dynamic(() => import('@/components/ArticlePublished'), { ssr: false });

export default function Home() {
  const [tweetText, setTweetText] = useState('');
  const [mediaArr, setMediaArr] = useState([]); 
  const [article, setArticle] = useState('');
  const [title, setTitle] = useState('');
  const [postUrl, setPostUrl] = useState('');

  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center text-gray-800">
        <h1 className="text-2xl font-bold">Tweet to Article</h1>
        {!tweetText && <TweetFetcher setTweetText={setTweetText} setMediaArr={setMediaArr} />}
        {tweetText && !article && <ArticleGenerator tweetText={tweetText} setArticle={setArticle} setTitle={setTitle} mediaArr={mediaArr} />}
        {article && !postUrl && <ArticleDisplay title={title} article={article} setPostUrl={setPostUrl} mediaArr={mediaArr} />}
        {postUrl && <ArticlePublished postUrl={postUrl} />}
      </main>
    </div>
  );
}
