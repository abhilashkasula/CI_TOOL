const {execSync, exec} = require('child_process');
const express = require('express');
const app = express();
const port = 8080;

const runTest = function(req, res) {
  const {previousCommit} = req.app.locals;
  previousCommit.testStatus = 'pass';
  exec('cd todo-bcalm && git pull origin master && npm run ciTest', err => {
    if (err) {
      previousCommit.testStatus = 'fail';
      execSync(
        `curl -X POST -H \'Content-type: application/json\' --data \'{"text":"Tests are failing. Pushed by ${previousCommit.author}"}\' https://hooks.slack.com/services/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`
      );
    }
    res.json(previousCommit);
  });
};

const setPreviousCommit = function(previousCommit, latestCommit) {
  const time = latestCommit.commit.author.date;
  previousCommit.sha = latestCommit.sha;
  previousCommit.author = latestCommit.commit.author.name;
  previousCommit.date = new Date(time).toGMTString().replace('GMT', '');
  previousCommit.message = latestCommit.commit.message;
};

const isUpdate = function(req, res) {
  const url = 'https://api.github.com/repos/bcalm/todo-bcalm/commits';
  const commits = JSON.parse(execSync(`curl -u ${process.env.GITHUB_TOKEN} ${url}`).toString());
  const [latestCommit] = commits;
  let status = false;
  const {previousCommit} = req.app.locals;
  if (previousCommit.sha != latestCommit.sha) {
    setPreviousCommit(previousCommit, latestCommit);
    status = true;
  }
  res.json(status);
};

app.locals.previousCommit = {};
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.get('/runTests', runTest);
app.get('/isUpdate', isUpdate);
app.listen(port, console.log('listening on:', port));
