var catScope, regEx, tableName, dictGr, tableGr, fieldGr, fieldArray = [], tableArray = [];

//Lookup tables that extend CAT Expense
//Store into object with table name
//Lookup fields on each table
//Store into object
//Loop through tables to create in CT scope
//Loop through fields to create in CT scope

regEx = /(x_qwo15_cat_)/; //Scope name
catScope = 'sys_scope=2a0a9d85db43cc10cf6a6f760596190e';

tableGr = new GlideRecord('sys_db_object');
tableGr.addEncodedQuery('super_class.labelLIKEExpense^nameLIKEx_qwo15_cat'); //Find all tables that extend Expense in the CAT scope
tableGr.query();

while(tableGr.next()) { //BEGIN THE LOOP!
  fieldArray = [];
  tableName = tableGr.name.getValue().replace(regEx, ""); //remove scope name
  var lastChar = tableName.charAt(tableName.length-1);
  if(lastChar == 's') {
    tableName = tableName.slice(0, -1); //remove trailing s aka fix my mistakes
  }
  dictGr = new GlideRecord('sys_dictionary');
  dictGr.addEncodedQuery('name='+tableGr.name.getValue()); //Find all fields on the table
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
    name: tableGr.name.getValue().replace(regEx, ""),
    label: tableGr.label.getDisplayValue(),
    fields: fieldArray
		});
}


for (var i = 0; i < tableArray.length; i++){
  var table = new GlideRecord('sys_db_object');
  table.initialize();
	table.label = tableArray[i].label;
  table.name = tableArray[i].name;
  table.sys_scope = '9eae4584dbd69c50cf6a6f76059619a7';
	table.super_class = '5922d10cdbd69c50cf6a6f760596193a';
  tableSysID = table.insert();
	var fields = tableArray[i].fields;
	for (var field = 0; field <fields.length; field++){
		fieldGr = new GlideRecord('sys_dictionary');
    fieldGr.initialize();
    fieldGr.column_label = fields[field].label;
	fieldGr.name = 'x_qwo15_ct_' + tableArray[i].name;
    fieldGr.internal_type = fields[field].type;
    fieldGr.reference = fields[field].reference;
    fieldGr.insert();
  }
}

/*
dictGr = new GlideRecord('sys_dictionary');
dictGr.addEncodedQuery('nameLIKEFlight');
dictGr.query();

while(dictGr.next()){
	fieldArray.push({
    name: dictGr.column_name.getValue(),
    label: dictGr.column_label.getDisplayValue(),
}*/

/*
tableGr = new GlideRecord('sys_db_object');
tableGr.addEncodedQuery(catScope);
tableGr.query();

while(tableGr.next()) {
  tableName = tableGr.name.getValue().replace(regEx, "");
  var lastChar = tableName.charAt(tableName.length-1);
  if(lastChar == 's') {
    tableName = tableName.slice(0, -1);
  }
  tableArray.push({
    name: tableName,
    label: tableGr.label.getDisplayValue(),
    extend: tableGr.super_class.getValue()
		})
}
dictGr = new GlideRecord('sys_dictionary');
	dictGr.addQuery('nameLIKEFlight');
	dictGr.query();
	while(dictGr.next()){
    var oldName = dictGr.name.getDisplayValue();
    var index = search(oldName, tableArray);
    tableArray[index].fields = [{
        name: dictGr.element.getValue(),
        label: dictGr.column_label.getDisplayValue(),
        type: dictGr.internal_type.getValue(),
        def: dictGr.default_value.getValue(),
        reference: dictGr.reference.getDisplayValue()
      }];
  };

*/

//tableArray;

/*var table = new GlideRecord('sys_db_object');
  table.initialize();
  table.name = "test_table";
	table.label = 'Test Expense';
  table.sys_scope = '9eae4584dbd69c50cf6a6f76059619a7';
	table.super_class = '5922d10cdbd69c50cf6a6f760596193a';
  tableSysID = table.insert();
	var fields = [{
        name: 'test_string',
        label: 'Test String',
        type: 'string',
        def: '',
        reference: ''
      }];
	for (var field = 0; field <fields.length; field++){
		fieldGr = new GlideRecord('sys_dictionary');
    fieldGr.initialize();
    fieldGr.name = "x_qwo15_ct_test_table";
    fieldGr.column_label = fields[field].label;
    fieldGr.internal_type = fields[field].type;
    //fieldGr.default = fields[field].def;
    fieldGr.reference = fields[field].reference;
    fieldGr.insert();
  }*/
