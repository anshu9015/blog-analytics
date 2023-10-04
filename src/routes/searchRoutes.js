const express = require('express');
const axios = require('axios');
const _ = require('lodash');
const router = express.Router();

// Define your search route under the router instance
router.get('/blog-search', async (req, res) => {
  try {
    console.log("hello--->0000000000000000");
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      },
    });

    const blogData = response.data.blogs;
    console.log("hello--->");
    const query = req.query.query;
    console.log("query--->", query);
    if (!query) {
      return res.status(400).json({ error: 'Please provide a search query.' });
    }

    
    const searchResults = [];
    const lowerQuery = query.toLowerCase(); 

    for (const blog of blogData) {
      if (_.toLower(blog.title).includes(lowerQuery)) {
        searchResults.push(blog);
      }
    }

    res.json({ searchResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching and analyzing blog data.' });
  }
});


module.exports = router;
