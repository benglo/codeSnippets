//Constants creator
var scope, regEx, tableName, tableGr, tableArray = [], constants = '', scriptGr, scriptName, scriptDesc;

function camelize(str) {
	return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
		return index === 0 ? word.toLowerCase() : word.toUpperCase();
	}).replace(/\s+/g, '');
}

regEx = /(x_qwo15_ct_)/; //Scope name
scopeName = 'x_qwo15_ct';
scope = '9eae4584dbd69c50cf6a6f76059619a7';
scriptName = 'constants';
scriptDesc = '';

tableGr = new GlideRecord('sys_db_object');
tableGr.addEncodedQuery('nameLIKEx_qwo15_ct'); //Find all tables that are in the app
tableGr.query();

while(tableGr.next()) { //BEGIN THE LOOP!
	tableName = tableGr.name.getDisplayValue().replace(regEx, ""); //remove app name

	tableArray.push({
		table: tableGr.name.getDisplayValue(),
		name: tableName,
		label: tableGr.label.getDisplayValue(),
		camelCase: camelize(tableGr.label.getDisplayValue())
	});
}

constants = 'var ' + scriptName + ' = Class.create();' + '\n\n\n';
constants += "constants.scope = '" + scopeName + "';" + '\n ';

for (var i = 0; i < tableArray.length; i++) {
	var constant = 'constants.'+ tableArray[i].camelCase +"Table = '" + tableArray[i].table + "';" + '\n ';
	constants += constant;
}

scriptGr = new GlideRecord('sys_script_include');
scriptGr.addEncodedQuery('sys_scope='+scope+'^name='+scriptName);
scriptGr.query();

if(scriptGr.next()) {
	scriptGr.script = constants;
	scriptGr.update();
} else {
	scriptGr.newRecord();
	scriptGr.name = scriptName;
	scriptGr.script = constants;
	scriptGr.sys_scope += scope;
	scriptGr.description = scriptDesc;
	scriptGr.insert();
}
