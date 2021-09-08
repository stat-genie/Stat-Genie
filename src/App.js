import { useState } from 'react';
import Container from '@material-ui/core/Container';
import TextField from'@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import NumericInput from 'react-numeric-input';
let fields = {"By Player":[],"By Team":[{Team_Filter_Type: 'Name',Name: 'Enter Team Name'}]};
const Query_Types = ['By Player','By Team'];
let query_type = Query_Types[0];
let filters_left = {};

function App() {
  console.log("start app");
  let columns = [];
  let counter;
  counter=0;
  const Filter_Types = {"By Player":['Name', 'Between Games', 'Stat', 'Position', 'Opponent'], "By Team":['Name', 'Between Games','Stat']};
  const num_cols = ["Start_Season","Start_Week","End_Season","End_Week", "Threshold"];
  const dropdown_cols = ["Stat", "Position", "Top"];
  const stats = ["Passing Yards","Passing TD","Rushing Yards","Rushing TDs","Receptions",
                "Receiving Yards", "Receiving TDS"];
  const positions = ["QB","RB","WR","TE","K"];
  const dropdowns = {"Stat": stats, "Position": positions, "Top": ["Top","Bottom"]};
  const default_filters =  { Player_Filter_Type: 'Name', Name: 'Enter Player Name'};


  function createFields(filtType, nw) {
    switch(filtType){
      case "Name":
        if(nw){
          columns.push([query_type.split(" ")[1] + "_Filter_Type", "Name"]);
          counter += 1;
        }
        return({[query_type.split(" ")[1] + "_Filter_Type"]: filtType, Name: 'Enter '+ query_type.split(" ")[1] + ' Name'} );
      case "Between Games":
        if(nw){
          columns.push([query_type.split(" ")[1] + "_Filter_Type","Start_Season","Start_Week","End_Season","End_Week"]);
          counter += 1;
        }
        return({[query_type.split(" ")[1] + "_Filter_Type"]: filtType, Start_Season: 2018, Start_Week: 1, End_Season: 2020, End_Week: 1});
      case "Opponent":
        if(nw){
          columns.push([query_type.split(" ")[1] + "_Filter_Type","Threshold","Stat"]);
          counter += 1;
        }
        return({[query_type.split(" ")[1] + "_Filter_Type"]: filtType, Top: "Top", Threshold:  32, Stat: 'Select Stat'});
      default:
        if(nw){
          columns.push([query_type.split(" ")[1] + "_Filter_Type",filtType]);
          counter += 1;
        }
        return({[query_type.split(" ")[1] + "_Filter_Type"]: filtType, [filtType]: 'Select ' + filtType});
    }
  }

  const [inputFields, setInputFields] = useState([
    default_filters,
  ]);

  const handleChangeInput = (index, event) =>{
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;
    filters_left[query_type] = updateFilters(values);
    setInputFields(values);
  }

  const handleChangeDropdownInput = (index, name, event) =>{
    const values = [...inputFields];
    values[index][name] = event.value;
    filters_left[query_type] = updateFilters(values);
    setInputFields(values);
  }

  const handleChangeNumericInput = (index, name, event) => {
    const values = [...inputFields];
    values[index][name] = event
    filters_left[query_type] = updateFilters(values);
    setInputFields(values);
    
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("InputFields",inputFields)
  }

  const handleAddFields = (index) => {
    console.log("add");
    let fieldType = filters_left[query_type][index+1][0];
    let newField = createFields(fieldType, true);
    let values =[...inputFields];
    values.push(newField);
    filters_left[query_type] = updateFilters(values);
    setInputFields(values);
  }

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    filters_left[query_type] = updateFilters(values);
    setInputFields(values);
  }

  const handleTypeChange = (index, e) => {
    console.log("handletypechange");
    const values = [...inputFields];
    if(typeof e.value == "undefined"){
      values[index] = createFields(e,false);
    }else{
      values[index] = createFields(e.value,false);
    }
    filters_left[query_type] = updateFilters(values);
    setInputFields(values);
  }

  const handleQueryTypeChange = (event) => {
    fields[query_type] = [...inputFields];
    query_type = event.value ;
    filters_left[query_type] = updateFilters(fields[query_type]);
    setInputFields(fields[query_type]);
  }

  const listAllProperties = (o) => {
    var objectToInspect;
    var result = [];
  
    for(objectToInspect = o; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)) {
      result = result.concat(
      Object.getOwnPropertyNames(objectToInspect)
      );
    }
    return result;
  }
  if(columns.length === 0 && query_type==="By Player" ){
    columns.push(listAllProperties(inputFields[counter]).slice(0,2));
    counter += 1;
  }

  const updateColumns = () => {
    let c = [];
    for( let i=0; i<inputFields.length;i++){
      let l = listAllProperties(inputFields[i]).length -12 ;
      c.push(listAllProperties(inputFields[i]).slice(0,l));
    }
    return(c);
  }

  const updateFilters = ( values ) => {
    console.log("updating filters...");
    let filts = [];
    console.log(Object.keys(values).length);
    for(let n=0;n<= Object.keys(values).length ;n++){
      filts[n] = Filter_Types[query_type];
      for( let i=0; i<n;i++){
        if(typeof values[i][query_type.split(" ")[1] + "_Filter_Type"]=="undefined"){
          console.log("undefined");
        }else{
          const where = filts[n].indexOf(values[i][query_type.split(" ")[1] + "_Filter_Type"].replace('_',' '));
          if (where > -1) {
            const x = [...filts[n]];
            x.splice(where,1);
            filts[n] = x;
          }
        }
      }
    }
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
      case "Top":
        return(1);
      default:
        break;
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
        case "Top":
          return(32);
        default:
          break;
      }
    
      
  }
  function get_options(field_name){
    switch(field_name){
      case "Stat":
        return(stats);
      case "Position":
        return(positions);
      default:
        break;
    }
  }

  const filter = (index,n) => {
    if(typeof filters_left[query_type] =="undefined"){
      filters_left[query_type] = updateFilters(inputFields);
    }
    if(columns[index][n].includes("Filter_Type")){
      return(
        <Dropdown 
        name={columns[index][n]}
        options={filters_left[query_type][index]} 
        value={filters_left[query_type][index][0]} 
        onChange = {event => handleTypeChange(index, event)}
        />
        );
    } else if(dropdown_cols.includes(columns[index][n])){
      return(
        <Dropdown 
        name={columns[index][n]}
        options={dropdowns[columns[index][n]]} 
        value={dropdowns[columns[index][n]][0]} 
        onChange = {event => handleChangeDropdownInput(index, columns[index][n], event)}
        />
        );
    } else if(num_cols.includes(columns[index][n])){
        return([
          <label>{columns[index][n].replace('_',' ').replace('Threshold','')}</label>,
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
    console.log("updating filters");
    columns = updateColumns();
    let out=[]
    if(typeof columns[index] == "undefined"){
      console.log("undefined columns");
    }else{
        for(let i = 0;i<columns[index].length;i++){
          out.push(filter(index,i));
      }
    }
    return(out);

    
  }
  const query_bar = () => {
    return(
    <Dropdown 
      name="query_bar"
      options={Query_Types} 
      value={Query_Types[0]} 
      onChange = {event => handleQueryTypeChange(event)}
      />
    )
  }

    return(
      <Container>
        <h1>New Search</h1>
        <form>
          <div key="query_bar">
            {query_bar()}
          </div>
          <br></br><br></br>
          { inputFields.map((inputFields, index) => (
            <div key={index}>
              {filters(index)}  
              <br></br>
              <IconButton
                onClick = {() => handleRemoveFields(index)}
              >
                <RemoveIcon></RemoveIcon>
              </IconButton>
              <IconButton
                onClick={() => handleAddFields(index)}
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

