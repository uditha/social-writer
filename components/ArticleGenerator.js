import { useState } from 'react';

const ArticleGenerator = ({ tweetText, setArticle, setTitle }) => {
  const [loading, setLoading] = useState(false);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tweetText }),
      });
      const data = await res.json();
      setArticle(data.article);
      setTitle(data.title);
    } catch (error) {
      console.error('Error fetching article:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-6xl font-bold text-blue-600">Generate Article With ChatGPT</h1>
      <p className="mt-3 text-3xl text-gray-700"> Press button to generate the article Now</p>
      <div className="mt-6 p-4 bg-white border border-gray-300 rounded-md shadow-md w-750">
        <p>{tweetText}</p>
      </div>
      <button
        onClick={fetchArticle}
        className="mt-4 p-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none"
      >
        {loading ? 'Loading...' : 'Generate Article'}
      </button>
    </div>
  );
};

export default ArticleGenerator;
