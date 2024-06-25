import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';

const ArticleGenerator = ({ tweetText, setArticle, setTitle, setLan, mediaArr }) => {
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('english');

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tweetText, language }),
      });
      const data = await res.json();
      setArticle(data.article);
      setTitle(data.title);
      setLan(data.lan)
    } catch (error) {
      console.error('Error fetching article:', error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-600">Generate Article With ChatGPT</h1>
      

      <div className="flex mt-6 p-4 bg-white border border-gray-300 rounded-md shadow-md grow space-x-4">
        {mediaArr.map((media, index) => (
          <img key={index} src={media.media_url_https} alt={`Media ${index}`} className="w-40" />
        ))}
      </div>

      <div className="p-4 bg-white border border-gray-300 rounded-md shadow-md w-full">
        <p>{tweetText}</p>
      </div>

      <p className="text-sm text-gray-700">Select language and press button to generate the article</p>

      <RadioGroup value={language} onChange={setLanguage} className="space-y-2">
        <RadioGroup.Label className="sr-only">Language</RadioGroup.Label>
        <div className="flex space-x-4 items-center justify-center">
          {['english', 'french', 'both'].map((lang) => (
            <RadioGroup.Option
              key={lang}
              value={lang}
              className={({ active, checked }) =>
                `${active ? 'ring-2 ring-blue-500 ring-opacity-60 ring-offset-2' : ''}
                 ${checked ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'}
                 relative flex cursor-pointer rounded-lg px-5 py-3 shadow-md focus:outline-none`
              }
            >
              {({ checked }) => (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <RadioGroup.Label
                        as="p"
                        className={`font-medium ${checked ? 'text-white' : 'text-gray-900'}`}
                      >
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </RadioGroup.Label>
                    </div>
                  </div>
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      
      <button
        onClick={fetchArticle}
        className="p-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Article'}
      </button>
    </div>
  );
};

export default ArticleGenerator;