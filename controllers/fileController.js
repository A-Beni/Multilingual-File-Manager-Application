const fs = require('fs');
const path = require('path');

exports.createFile = (req, res) => {
    const { fileName, content } = req.body;
    const filePath = path.join(__dirname, `../files/${fileName}`);
    fs.writeFile(filePath, content, (err) => {
        if (err) return res.status(500).json({ message: 'Error creating file', err });
        res.json({ message: 'File created successfully' });
    });
};

exports.readFile = (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, `../files/${fileName}`);
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) return res.status(404).json({ message: 'File not found', err });
        res.json({ content: data });
    });
};

exports.updateFile = (req, res) => {
    const { fileName } = req.params;
    const { content } = req.body;
    const filePath = path.join(__dirname, `../files/${fileName}`);
    fs.writeFile(filePath, content, (err) => {
        if (err) return res.status(500).json({ message: 'Error updating file', err });
        res.json({ message: 'File updated successfully' });
    });
};

exports.deleteFile = (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, `../files/${fileName}`);
    fs.unlink(filePath, (err) => {
        if (err) return res.status(404).json({ message: 'File not found', err });
        res.json({ message: 'File deleted successfully' });
    });
};
