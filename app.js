const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');

//File Reading System
const XLSX = require('xlsx')
const fs = require('fs');
const testFolder = './uploads/';
let exelcontent;

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

//start app
const port = process.env.PORT || 3000;

app.listen(port, () =>
    console.log(`App is listening on port ${port}.`)
);

app.post('/upload-file', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let excel = req.files.excel;

            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            await excel.mv('./uploads/' + excel.name);

            await getAndReadFile(excel.name)

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: excel.name,
                    mimetype: excel.mimetype,
                    size: excel.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


function getAndReadFile(test){
    fs.readdir(testFolder, (err, files) => {
        files.forEach(file => {
            if(test === file){
                let workbook = XLSX.readFile(`${testFolder}${file}`);
                let sheet_name_list = workbook.SheetNames;
                let xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
                exelcontent = xlData
                console.log(exelcontent)
            }
        });
    });
}


