import request from 'request';
import fs from 'fs';
import chalk from 'chalk'

const fetchData = (callback, url, data) => {
  if (!data) data = [];
  try{
    data = JSON.parse(fs.readFileSync("./data.json").toString());
    console.log(`\n${chalk.yellow("JSON already created")}`);
    callback(data);
  }catch(e){
    console.log('fechting data...');
    request({ url, json: true }, (error, response) => {
      if (response.body) {
        data = [...data, ...response.body.results];
      }
      if (response.body.next !== null)
        fetchData(callback, response.body.next, data);
      else {
        fs.writeFileSync("./data.json",JSON.stringify(data));
        console.log(`\n${chalk.yellow("JSON created")}`);
        callback(data);
      } 
    });
  }
};

export { fetchData }; 