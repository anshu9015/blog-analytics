const express = require('express');
const axios = require('axios');
const _ = require('lodash');
const router = express.Router();

// Define your route under the router instance
router.get('/blog-stats', async (req, res) => {
  try {

    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      },
    });
    //console.log("req.query--->",req.query);
    // console.log('repsonse---->',response);

    // Extract the blog data
    const blogData = response.data.blogs;
    console.log('blogData---->',blogData);

    //write code here
    const totalLength = blogData.length;
    console.log("totalLength---->", totalLength);

    //blog with longest title
    let blog = null;
    let max = 0;
    for(let i = 0; i<blogData.length;++i){
        let currentBlog = blogData[i].title;
        let longestLength = currentBlog.length;

        if(longestLength>max){
            max= longestLength;
            blog= currentBlog;
        }
    }
    const title = blog;
    console.log("title---->", title);

    //blog with substring privacy
    let count =0;
    for(let i = 0; i<blogData.length;++i){
        let currentBlog = blogData[i].title;
        let bool = currentBlog.toLowerCase().includes("privacy");
        
        if(bool){
            count+= 1;
        }
    }
    
    const countPrivacy = count;
    console.log("countPrivacy----->",countPrivacy);


    //create array with no duplocate of title means unique title
    const unique = new Set();
    for(blog of blogData){
        unique.add(blog.title);
    }

    const array = Array.from(unique);

    console.log("Array with unique title------>", array);

    


    res.json({
        blogData,
        totalLength,
        title,
        countPrivacy,
        array,

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching and analyzing blog data.' });
  }
});

module.exports = router;
