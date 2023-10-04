const _ = require('lodash');

// Caching-related code here (if using memoization)
// Import Lodash's memoize function
const memoize = require('lodash/memoize');

// Define a function to fetch and analyze blog data
const fetchDataAndAnalyze = async () => {
    // Make a GET request to the third-party API
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
        headers: {
            'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
        },
    });

    // Extract the blog data
    const blogData = response.data;

    // Calculate the total number of blogs
    const totalBlogs = blogData.length;

    // Find the blog with the longest title
    const longestTitleBlog = _.maxBy(blogData, (blog) => blog.title.length);

    // Determine the number of blogs with titles containing the word "privacy."
    const privacyBlogs = _.filter(blogData, (blog) => _.includes(_.toLower(blog.title), 'privacy'));

    // Create an array of unique blog titles (no duplicates)
    const uniqueTitles = _.uniqBy(blogData, 'title');

    // Return the statistics
    return {
        totalBlogs,
        longestTitleBlog: longestTitleBlog.title,
        privacyBlogs: privacyBlogs.length,
        uniqueTitles: uniqueTitles.map((blog) => blog.title),
    };
};

// Apply memoization to the fetchDataAndAnalyze function with a cache expiration of 1 hour (3600000 milliseconds)
const memoizedFetchDataAndAnalyze = memoize(fetchDataAndAnalyze, { maxAge: 3600000 });

// Update the /api/blog-stats route to use memoizedFetchDataAndAnalyze
app.get('/api/blog-stats', async (req, res) => {
    try {
        // Fetch and analyze data with memoization
        const statistics = await memoizedFetchDataAndAnalyze();

        // Respond to the client with the cached statistics
        res.json(statistics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching and analyzing blog data.' });
    }
});

