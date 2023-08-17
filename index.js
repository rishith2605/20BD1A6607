const express = require('express');
const axios = require('axios');
const app = express();
const port = 8008;

// Endpoint to handle the /numbers route
app.get('/numbers', async (req, res) => {
    const urls = req.query.url;

    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ error: 'Invalid URLs' });
    }

    const uniqueNumbers = new Set();

    try {
        const requests = urls.map(async (url) => {
            try {
                const response = await axios.get(url);
                const data = response.data;
                if (data && Array.isArray(data.numbers)) {
                    data.numbers.forEach((number) => {
                        uniqueNumbers.add(number);
                    });
                }
            } catch (error) {
                console.error(`Error fetching data from ${url}: ${error.message}`);
            }
        });

        await Promise.all(requests);

        const sortedUinqueArray = Array.from(uniqueNumbers);
        sortedUinqueArray.sort((a,b) => a-b);
        res.json({ numbers:  sortedUinqueArray});
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});