'use strict';

const fs = require('fs');
const Validator = require('slack-rpg-addon-validator');

const ignoreFolders = ['schema', '.git', 'node_modules'];

fs.readdir(process.env.PWD, (err, files) => {
  if (err) {
    console.log('Could not read directory!');
    process.exitCode = 1;
    return;
  }

  files.forEach((fileName) => {
    const fileStat = fs.statSync(fileName);

    if (fileStat.isDirectory() && ignoreFolders.indexOf(fileName) === -1) {
      fs.readdir(`${process.env.PWD}/${fileName}`, (err, dirFiles) => {
        if (err) {
          console.log(`Could not read directory: ${fileName}`);
          process.exitCode = 1;
          return;
        }

        console.log(`${fileName}:`);

        dirFiles.forEach((dirFileName) => {
          fs.readFile(`${process.env.PWD}/${fileName}/${dirFileName}`, (dirErr, content) => {
            if (dirErr) {
              console.log(`Could not read file: ${fileName}/${dirFileName}`);
              process.exitCode = 1;
              return;
            }

            try {
              if (Validator.check(content.toString())) {
                console.log(`- ${dirFileName} is OK!`);
              } else {
                console.log(`- ${dirFileName} is NOT OK!\nUnknown Error!`);
                process.exitCode = 1;
              }
            } catch (error) {
              console.log(`- ${dirFileName} is NOT OK!`);
              console.log(`${error.message}`);
              process.exitCode = 1;
            }
          });
        });
      });
    }
  });
});
