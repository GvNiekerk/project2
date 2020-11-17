const router = require('express').Router();
const verify = require('./verifyToken');
const fs = require('fs');
const FileData = require('../Models/FileData');
const { request } = require('http');
const { object } = require('@hapi/joi');

router.post('/getdata', verify, async (req, res) => {

    console.log(req.body.fileName);

    FileData.findOne({ fileName: req.body.fileName }, function (err, file) {

        if (err) {
            return res.status(400).send({
                status: "Failed",
                message: "No file found"
            });
        }

        if (file) {

            res.send({
                status: "Success",
                message: "File Found: " + file.fileName,
                data : file
            });
        }
        else {

            res.send({
                status: "Failed",
                message: "No file found"
            });
        }

    })
})

router.post('/updateData', verify, async (req, res) => {

    var query = {"_id": req.body.id}
    var newFileData  = 
    {
        fileName : req.body.fileName, 
        meta: req.body.meta
    }

    FileData.findOneAndUpdate(query, newFileData, function(err, file){
        if (err) {
            return res.status(400).send({
                status: "Failed",
                message: err
            });
        }

        file.meta = newFileData.meta;

        if (file) {

            res.send({
                status: "Success",
                message: "File Updated: " + file.fileName,
                data : file
            });
        }
        else {

            res.send({
                status: "Failed",
                message: "No file found"
            });
        }
    })
    


})  

module.exports = router;