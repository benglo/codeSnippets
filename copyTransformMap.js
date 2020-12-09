var oldScope, newScope, mapName, fieldGr, mapGr, scriptGr, newField, newMap, newScript, fieldTable = 'sys_transform_entry', scriptTable = 'sys_transform_script', sourceTable = 'x_qwo15_ct_request_staging';

oldScope = 'sys_scope=2a0a9d85db43cc10cf6a6f760596190e';
newScope = '9eae4584dbd69c50cf6a6f76059619a7';
newMap = '4d404698dbc128107f4aa03114961912';

var query = ''; //Encoded query to get the records

mapGr = new GlideRecord('sys_transform_map');
mapGr.addEncodedQuery(query); //Find all transform maps
mapGr.query();
while(mapGr.next()) { //BEGIN THE LOOP!
  newMap = new GlideRecord('sys_transform_map');
  for (prop in mapGr) {   
    newMap.setValue(prop, mapGr.getValue(prop));
    newMap.setValue('sys_scope', newScope); //Sets the new scope
    newMap.setValue('source_table', sourceTable); //Sets the new staging table
  }
  newMap.insert();
  
  fieldGr = new GlideRecord(fieldTable);
  fieldGr.addEncodedQuery('map='+ mapGr.getDisplayValue('sys_id')); //Find all fields related to the map
  fieldGr.query();
  while(fieldGr.next()){
    newField = new GlideRecord(fieldTable);
    for (prop in fieldGr) {
      newField.setValue(prop, fieldGr.getValue(prop));
      newField.setValue('map', newMap.getValue('sys_id'));
      newField.setValue('sys_scope', newScope);
      newField.setValue('source_table', sourceTable);
    }
		newField.insert();    
  }
  scriptGr = new GlideRecord(scriptTable);
  scriptGr.addEncodedQuery('map='+ mapGr.getDisplayValue('sys_id')); //Find all scripts related to the map
  scriptGr.query();
  while(scriptGr.next()){
    newScript = new GlideRecord(scriptTable);
    for (prop in scriptGr) {
      newScript.setValue(prop, scriptGr.getValue(prop));
      newScript.setValue('map', newMap.getValue('sys_id'));
      newScript.setValue('sys_scope', newScope);
    }
		newScript.insert();    
  }
}

