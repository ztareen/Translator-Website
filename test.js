const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/save', (req, res) => {
    const { inputText } = req.body;

    if (inputText) {
        fs.appendFile('user_input.txt', inputText + '\n', (err) => {
            if (err) {
                res.status(500).send('Error saving the input.');
            } else {
                res.send('Input saved successfully!');
            }
        });
    } else {
        res.status(400).send('Bad Request: Please provide input.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});