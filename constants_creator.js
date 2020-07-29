//Constants creator

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}


var scope, regEx, tableName, tableGr, tableArray = [], constants = '', scriptGr;

regEx = /(x_qwo15_ct_)/; //Scope name
scope = '9eae4584dbd69c50cf6a6f76059619a7'

tableGr = new GlideRecord('sys_db_object');
		tableGr.addEncodedQuery('nameLIKEx_qwo15_ct'); //Find all tables that are in the app
		tableGr.query();

while(tableGr.next()) { //BEGIN THE LOOP!
  fieldArray = [];
  tableName = tableGr.name.getDisplayValue().replace(regEx, ""); //remove app name
    
  tableArray.push({
    table: tableGr.name.getDisplayValue(),
    name: tableName,
    label: tableGr.label.getDisplayValue(),
    camelCase: camelize(tableGr.label.getDisplayValue())
		});
}

for (var i = 0; i < tableArray.length; i++) {
  var constant = 'constants.'+ tableArray[i].camelCase +"Table = '" + tableArray[i].table + "';" + '\n ';
  constants += constant;
}

scriptGr = new GlideRecord('sys_script_include');
scriptGr.addEncodedQuery('sys_scope=9eae4584dbd69c50cf6a6f76059619a7^name=constants');
scriptGr.query();

if(scriptGr.next()) {
	scriptGr.script = constants;
  scriptGr.update();
} else {
scriptGr = new GlideRecord('sys_script_include');
scriptGr.newRecord();
scriptGr.name = 'constants';
scriptGr.script = constants;
scriptGr.sys_scope = scope;
scriptGr.insert();
}
