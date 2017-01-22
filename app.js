// Copyright 2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

process.env.DEBUG = 'actions-on-google:*';
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json({type: 'application/json'}));

const CONFIRM_TYPE_CONTEXT = 'confirm_type';
const CLIENT_CODE_ACTION = 'get_client_code';
const EXPENSES_TYPE_ACTION = 'ask_expenses_or_services';
const EXPENSES_TYPE_ARGUMENT = 'codetype';
const CLIENT_NAME_ARGUMENT = 'clientname';

app.post('/', function (req, res) {
  const assistant = new Assistant({request: req, response: res});
  console.log('Request headers: ' + JSON.stringify(req.headers));
  console.log('Request body: ' + JSON.stringify(req.body));

  function askExpensesOrServices(assistant){
    let name = assistant.getArgument(CLIENT_NAME_ARGUMENT);
    assistant.setContext(CONFIRM_TYPE_CONTEXT);
    assistant.data.clientName = name;
    assistant.ask('You asked about ' + name + '.  Do you need an expenses or services code?');
  }

  function getClientCode (assistant) {
	  let type = assistant.getArgument(EXPENSES_TYPE_ARGUMENT);
    assistant.tell('I\'ll try to get the ' + assitant.data.clientName + ' ' + type + ' code.');
	  /*if (name === 'CRS'){
		  assistant.tell('The CRS services code is 1 2 5 0 0 0 2 3');
	  }
	  else{
	    assistant.ask ('Sorry, I dont know any ' + name + ' client codes.  Try again.');*/
	  }
    
  let actionMap = new Map();
  actionMap.set(CLIENT_CODE_ACTION, getClientCode);
  actionMap.set(EXPENSES_TYPE_ACTION, askExpensesOrServices);
  assistant.handleRequest(actionMap);
});

if (module === require.main) {
  // [START server]
  // Start the server
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log('App listening on port %s', port);
  });
  // [END server]
}

module.exports = app;
