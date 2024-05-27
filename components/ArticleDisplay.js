import { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill'; // import Quill
import 'react-quill/dist/quill.snow.css'; // import Quill styles

const ArticleDisplay = ({ setPostUrl, title, article, mediaArr }) => {
  const [loading, setLoading] = useState(false);
  const [titleEdited, setTitleEdited] = useState(title); // state for title
  const [articleEdited, setArticleEdited] = useState(article); // state for article
  const [status, setStatus] = useState('publish'); // state for status

  const postToWordPress = async () => {
    setLoading(true);
    
    const url = 'https://udimaxweb.com/blog/wp-json/wp/v2/posts';
    const username = 'udimax';
    const password = 'Harangala@13';
    const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

    const articleData = {
      title: titleEdited,
      content: articleEdited,
      // status: 'publish', // 'draft' to save as draft
      status: status, 
    };
      
    try {
      const response = await axios.post(url, articleData, {
        headers: {
          'Authorization': auth,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        console.log('Article published successfully!');
        console.log('View it at:', response.data);
        setPostUrl(response.data.link);
      } else {
        console.error('Error:', response.status);
        console.error(response.data);
      }
    } catch (error) {
      console.error('Error posting to WordPress:', error);
    }
      
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600">Generated Article</h1>
      <div className="mt-6 p-4 bg-white border border-gray-300 rounded-md shadow-md">
        { mediaArr && (
          <div className="flex space-x-4 mb-5">
            {mediaArr.map((media, index) => (
              <img key={index} src={media.media_url_https} alt={`Media ${index}`} className="w-40" />
            ))}
          </div>
        )}
        <input
          type="text"
          value={titleEdited}
          onChange={e => setTitleEdited(e.target.value)}
          className="w-full p-2 text-xl font-bold text-gray-800 border border-gray-300 rounded-md"
          placeholder="Enter title here"
        />
        <ReactQuill value={articleEdited} onChange={setArticleEdited} className="text-left mt-10" />
        <div className="flex items-center mt-4">
          <input
            type="radio"
            id="publish"
            name="status"
            value="publish"
            checked={status === 'publish'}
            onChange={e => setStatus(e.target.value)}
            className="mr-2"
          />
          <label htmlFor="publish" className="mr-4">Publish</label>
          <input
            type="radio"
            id="draft"
            name="status"
            value="draft"
            checked={status === 'draft'}
            onChange={e => setStatus(e.target.value)}
            className="mr-2"
          />
          <label htmlFor="draft">Draft</label>
        </div>
        <button
          onClick={postToWordPress}
          className="mt-4 p-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none"
        >
          {loading ? 'Loading...' : 'Post to Blog'}
        </button>
      </div>
    </div>
  );
};

export default ArticleDisplay;