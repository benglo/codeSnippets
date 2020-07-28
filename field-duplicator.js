var catScope, regEx, tableName, dictGr, tableGr, fieldGr, fieldArray = [], tableArray = [];

regEx = /(x_qwo15_cat_)/; //Scope name
catScope = 'sys_scope=2a0a9d85db43cc10cf6a6f760596190e';

var query ='sys_scope=2a0a9d85db43cc10cf6a6f760596190e^super_class=NULL^label!=Expense^ORlabel=NULL^label!=Company^ORlabel=NULL'

tableGr = new GlideRecord('sys_db_object');
tableGr.addEncodedQuery(query); //Find all tables
tableGr.query();

while(tableGr.next()) { //BEGIN THE LOOP!
  fieldArray = [];
  tableName = tableGr.name.getValue().replace(regEx, ""); //remove scope name
  var lastChar = tableName.charAt(tableName.length-1);
  if(lastChar == 's') {
    tableName = tableName.slice(0, -1); //remove trailing s aka fix my mistakes
  }
  dictGr = new GlideRecord('sys_dictionary');
  dictGr.addEncodedQuery('name='+tableGr.name.getValue()+'^elementNOT LIKEsys'); //Find all fields on the table
	dictGr.query();
	while(dictGr.next()){
    if(dictGr.internal_type.getValue() != "collection" && dictGr.internal_type.getValue() != "GUID") { //Exclude the collection and sys_id fields
    fieldArray.push({
        name: dictGr.element.getValue(),
        label: dictGr.column_label.getDisplayValue(),
        type: dictGr.internal_type.getValue(),
        def: dictGr.default_value.getValue(),
        reference: dictGr.reference.getDisplayValue()
      });
    }
	}
    tableArray.push({
    oldName: tableGr.name.getValue(),
    name: tableName,
    label: tableGr.label.getDisplayValue(),
    fields: fieldArray
		});
}

for (var i = 0; i < tableArray.length; i++){
  /*var table = new GlideRecord('sys_db_object');
  table.initialize();
	table.label = tableArray[i].label;
  table.name = tableArray[i].name;
  table.sys_scope = '9eae4584dbd69c50cf6a6f76059619a7';
	table.super_class = '5922d10cdbd69c50cf6a6f760596193a';
  tableSysID = table.insert();*/
	var fields = tableArray[i].fields;
	for (var field = 0; field <fields.length; field++){
		fieldGr = new GlideRecord('sys_dictionary');
    fieldGr.initialize();
    fieldGr.name = 'x_qwo15_ct_' + tableArray[i].name;
    fieldGr.column_label = fields[field].label;
    fieldGr.internal_type = fields[field].type;
    fieldGr.reference = fields[field].reference;
    fieldGr.insert();
  }
}

// labelLIKEcompany
//super_class.labelLIKEtask^nameLIKEx_qwo15_cat
//elementNOT LIKEsys^nameLIKEcompany
//ct request 08103d48db9a9c50cf6a6f76059619a6
//tableArray;
