const showResult = function({testStatus, author, date, message}) {
  document.getElementById('test').style['color'] = 'white';
  document.getElementById('waiting').className = 'hide';
  const test = document.getElementById('test');
  test.style['backgroundColor'] = 'green';
  test.innerHTML = `<i>Tests status: ${testStatus}ing</i></br>`;
  test.innerHTML += `<i class="fa fa-user" aria-hidden="true"></i> <h>${author} </h> <br>`;
  test.innerHTML += `<i class="fa fa-clock-o" aria-hidden="true"></i> <span> ${date} </span> <br>`;
  test.innerHTML += `<i class="fa fa-commenting-o" aria-hidden="true"></i> <span>${message} </span> <br>`;
  if (testStatus === 'fail') {
    test.style['backgroundColor'] = 'red';
    test.innerHTML += `<a href="testReport.html">Report</button>`;
  }
};

const load = function() {
  document.getElementById('test').style['backgroundColor'] = 'blue';
  document.getElementById('test').style['color'] = 'black';
  document.getElementById('test').innerHTML = 'Tests are running';
  document.getElementById('waiting').className = 'show';
  fetch('/runTests')
    .then(res => res.json())
    .then(showResult);
};

const update = function() {
  fetch('/isUpdate')
    .then(res => res.json())
    .then(isAnyNewCommit => {
      if (isAnyNewCommit) {
        load();
      }
    });
};

update();
setInterval(update, 20000);
