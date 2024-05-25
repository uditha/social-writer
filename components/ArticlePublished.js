const ArticlePublished = ({ postUrl }) => (
    <div>
      <h1 className="text-6xl font-bold text-blue-600">Article Published!</h1>
      <p className="mt-3 text-3xl text-gray-700">View the article at:</p>
      <a
        href={postUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 p-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none"
      >
        {postUrl}
      </a>
    </div>
  );
  
  export default ArticlePublished;
  