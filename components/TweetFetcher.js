import { useState } from 'react';

const TweetFetcher = ({ setTweetText, setMediaArr }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTweetText = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/get-tweet-new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setTweetText(data.text);
      setMediaArr(data.media);
    } catch (error) {
      console.error('Error fetching tweet text:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-6xl font-bold text-blue-600">Twitter Text Fetcher</h1>
      <p className="mt-3 text-3xl text-gray-700">Enter a tweet URL to fetch its text</p>
      <div className="mt-6 flex flex-col items-center">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter tweet URL"
          className="p-4 border border-gray-300 rounded-md shadow-sm w-full focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={fetchTweetText}
          className="mt-4 p-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none"
        >
          {loading ? 'Loading...' : 'Get Tweet Text'}
        </button>
      </div>
    </div>
  );
};

export default TweetFetcher;
