const router = require('express').Router();
const verify = require('./verifyToken');
const fs = require('fs');
const FileData = require('../Models/FileData');
var PdfReader = require("pdfreader").PdfReader;
var XLSX = require('xlsx');
const Luhn = require('luhn-js');

async function LoadText(ext, buff) {
    switch (ext) {
        case 'txt':
            data = buff.toString('ascii');
            return data;

        case 'pdf':
            var read = new PdfReader().parseBuffer(buff, async function (err, item) {
                if (err) {
                    console.log(err);
                } else if (!item) {
                    console.log(err);
                } else if (item.text) {
                    content = item.text;
                    data = content;
                }
            })
            return data;

        case 'xlsx' || 'xls':
            var result = {};
            buff = new Uint8Array(buff);
            var workbook = XLSX.read(buff, {
                type: 'array'
            });
            workbook.SheetNames.forEach(function (sheetName) {
                var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                    header: 1
                });
                if (roa.length) result[sheetName] = roa;
            });
            data = JSON.stringify(result);
            return data;

        default:
            return null;
    }
}

function ClassifyData(data) {
    var email = "";
    var mobile = "";
    var id = "";

    email = data.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    mobile = data.match(/(?<!\d)\d{10}(?!\d)/g);
    id = data.match(/(?<!\d)\d{13}(?!\d)/g);

    return {
        email : email ? true : false,
        mobile : mobile ? true : false,
        id : Luhn.isValid(id.toString())
    }
}

router.post('/upload', verify, async (req, res) => {

    var ext = req.body.fileName.split('.')[1];

    var base64Data = req.body.base64;

    var buff = Buffer(base64Data, 'base64');

    var data = await LoadText(ext, buff);

    var meta = ClassifyData(data);

    console.log(meta);

    var metaData = new FileData({
        fileName: req.body.fileName,
        meta: {
            email: meta.email,
            mobile: meta.mobile,
            id: meta.id
        }
    })

    try {
        const saveData = await metaData.save();
        res.send({
            status: "Success",
            message: "File Uploaded successfully.",
            metaData: metaData
        });

    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;