import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    try {
        // Format the current date and time, replacing colons with hyphens
        const today = new Date().toISOString().replace(/:/g, '-');
         //stores the Timestamp directory to timestampDir
        const timestampDir = 'TimeStamp';

        // Ensure the 'TimeStamp' directory exists or not
        if (!fs.existsSync(timestampDir)) {

            //if there is no more Timestamp directory found it will creates a new Timestamp directory
            fs.mkdirSync(timestampDir);
        }
 //filepath denotes the path of the timestamps which are created and stored it as file named as the current data and time value
        // Define the file path
        const filePath = path.join(timestampDir, `${today}.txt`);

        // Write the current date and time to the file
        //the file is created and named as the current date 
        fs.writeFileSync(filePath, `${today}`, 'utf8');

        // Read the content of the file
        const data = fs.readFileSync(filePath, 'utf8');

        // Send the content of the file as the response
         //if the status code is success the given message will be displayed in the ui
        res.status(200).send(data);

    } catch (error) {
        console.error(error);
        res.status(400).send('Internal server error');
    }
});

// Endpoint to read all timestamp files
app.get('/read', (req, res) => {
    const folderPath = 'TimeStamp';    // Define the directory path

 // Read the contents of the directory
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            // Log error and send a 500 status if an error occurs while reading the directory
            console.error(err);
            res.status(400).send('An error occurred while listing the files from the directory');
        } else {
            // Filter the list to include only .txt files
            const textFiles = files.filter((file) => path.extname(file) === '.txt');

             //              (1)path.extname(file) extracts the file extension.
// (2).filter((file) => path.extname(file) === '.txt') keeps only .txt files from the list of files array.

// Send the list of .txt files as a JSON response
            res.status(200).json(textFiles);
        }
    });
});



app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
