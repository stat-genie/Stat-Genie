import ReactDropdown, { useState } from 'react';
import Container from '@material-ui/core/Container';
import TextField from'@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { SystemUpdate } from '@material-ui/icons';
import NumericInput from 'react-numeric-input';





function App() {
  console.log("start app");
  let columns = [];
  let counter;
  counter=0;
  const Filter_Types = ['Player Name', 'Between Games', 'Stat', 'Position'];
  const num_cols = ["Start_Season","Start_Week","End_Season","End_Week"];
  const dropdown_cols = ["Stat", "Position"];
  const stats = ["Passing Yards","Passing TD","Rushing Yards","Rushing TDs","Receptions",
                "Receiving Yards", "Receiving TDS"];
  const positions = ["QB","RB","WR","TE","K"];
  function createFields(filtType, nw) {
    switch(filtType){
      case "Player Name":
        if(nw){
          columns.push(["Filter_Type", "Player_Name"]);
          counter += 1;
        }
        return({Filter_Type: 'Player Name', Player_Name: 'Enter Player Name'} );
        break;
      case "Between Games":
        if(nw){
          columns.push(["Filter_Type","Start_Season","Start_Week","End_Season","End_Week"]);
          counter += 1;
        }
        return({Filter_Type: 'Between Games',Start_Season: 2018, Start_Week: 1, End_Season: 2020, End_Week: 1});
        break;
      case "Stat":
        if(nw){
          columns.push(["Filter_Type","Stat"]);
          counter += 1;
        }
        return({Filter_Type: 'Stat', Stat: 'Select Stat'});
        break;
      case "Position":
        if(nw){
          columns.push(["Filter_Type","Position"]);
          counter += 1;
        }
        return({Filter_Type: 'Position', Position: 'Select Position'});
        break;
    }
  }
  const [inputFields, setInputFields] = useState([
    { Filter_Type: 'Player Name', Player_Name: 'Enter Player Name'},
  ]);

  const handleChangeInput = (index, event) =>{
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;
    setInputFields(values);
    columns = updateColumns();
    filters_left= updateFilters();
  }
  const handleChangeDropdownInput = (index, name, event) =>{
    const values = [...inputFields];
    values[index][name] = event.value;
    setInputFields(values);
    columns = updateColumns();
    filters_left= updateFilters();
  }

  const handleChangeNumericInput = (index, name, event) => {
    const values = [...inputFields];
    values[index][name] = event
    setInputFields(values);
    columns = updateColumns();
    
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("InputFields",inputFields)
  }
  const handleAddFields = (fieldType,index) => {
    console.log("add");
    setInputFields([...inputFields, createFields(fieldType, true)]);
    columns = updateColumns();
    //handleTypeChange(index,fieldType);
  }

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
    columns = updateColumns();
    

  }

  const handleTypeChange = (index, e) => {
    console.log("handletypechange");
    const values = [...inputFields];
    if(typeof e.value == "undefined"){
      values[index] = createFields(e,false);
    }else{
      values[index] = createFields(e.value,false);
    }
    setInputFields(values);
    columns = updateColumns();
    filters_left = updateFilters();
  }
  function listAllProperties(o) {
    var objectToInspect;
    var result = [];
  
    for(objectToInspect = o; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)) {
      result = result.concat(
      Object.getOwnPropertyNames(objectToInspect)
      );
    }
  
    return result;
  }
  if(columns.length == 0 ){
    columns.push(listAllProperties(inputFields[counter]).slice(0,2));
    counter += 1;
  }

  function updateColumns() {
    let c = [];
    for( let i=0; i<inputFields.length;i++){
      let l = listAllProperties(inputFields[i]).length -12 ;
      c.push(listAllProperties(inputFields[i]).slice(0,l));
      
    }
    return(c);
  }
  let filters_left = [];
  function updateFilters(){
    let filts = [];
    for(let n=0;n<inputFields.length;n++){
      filts[n] = Filter_Types;
      for( let i=0; i<n;i++){
        const where = filts[n].indexOf(inputFields[i]["Filter_Type"].replace('_',' '));
        if (where > -1) {
          const x = [...filts[n]];
          x.splice(where,1);
          filts[n] = x;
        }
    }}
    return(filts);
}
 
  function calc_min(field_name){
    switch(field_name){
      case "Start_Week":
        return(1)
      case "End_Week":
        return(1);
      case "Start_Season":
        return(2018);
      case "End_Season":
        return(2018);
    }
  }
    function calc_max(field_name){
      switch(field_name){
        case "Start_Week":
          return(17)
        case "End_Week":
          return(17);
        case "Start_Season":
          return(2020);
        case "End_Season":
          return(2020);
      }
    
      
  }
  function get_options(field_name){
    switch(field_name){
      case "Stat":
        return(stats);
      case "Position":
        return(positions);
    }
  }
  const filter = (index,n) => {
    filters_left= updateFilters();
    if(columns[index][n]=="Filter_Type"){
      return(
        <Dropdown 
        name={columns[index][n]}
        options={filters_left[index]} 
        value={filters_left[index][0]} 
        onChange = {event => handleTypeChange(index, event)}
        />
        );
    } else if(dropdown_cols.includes(columns[index][n])){
      return(
        <Dropdown 
        name={columns[index][n]}
        options={get_options(columns[index][n])} 
        value={get_options(columns[index][n])[0]} 
        onChange = {event => handleChangeDropdownInput(index, columns[index][n], event)}
        />
        );
    } else if(num_cols.includes(columns[index][n])){
        return([
          ///<label {columns[index][n]}></label>
          <label>{columns[index][n].replace('_',' ')}</label>,
          <NumericInput
          min={calc_min(columns[index][n])}
          max={calc_max(columns[index][n])}
          name={columns[index][n]}
          label={columns[index][n].replace('_',' ')}
          value = {inputFields[index][columns[index][n]]}
          onChange={event => handleChangeNumericInput(index, columns[index][n], event)}>
          </NumericInput>
        ]
        );
    }else{
      return(
        <TextField
        name={columns[index][n]}
        label={columns[index][n].replace('_',' ')}
        value = {inputFields[index][columns[index][n]]}
        onChange={event => handleChangeInput(index, event)}
        >
        </TextField>);
    }
      
  }

  const filters = (index) => {
    columns = updateColumns();
    let out=[]
    if(typeof columns[index] == "undefined"){

    }else{
        for(let i = 0;i<columns[index].length;i++){
        out.push(filter(index,i));
      }
    }
    return(out);
  }
  return(
    <Container>
      <h1>New Filter</h1>
      <form>
        { inputFields.map((inputFields, index) => (
          <div key={index}>
            {filters(index)}  
            <IconButton
              onClick = {() => handleRemoveFields(index)}
            >
              <RemoveIcon></RemoveIcon>
            </IconButton>
            <IconButton
              onClick={() => handleAddFields(filters_left[filters_left.length-1][0],)}
            >
              <AddIcon>
              </AddIcon>
            </IconButton>
          </div>
        ))}
        <Button 
          variant="contained" 
          type="submit"
          onClick={handleSubmit}
          >
          Search
        </Button>
      </form>
    </Container>
  )
}

export default App;

