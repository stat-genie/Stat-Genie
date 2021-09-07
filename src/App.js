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
  const Filter_Types = {"By Player":['Name', 'Between Games', 'Stat', 'Position'], "By Team":['Name', 'Between Games','Stat']};
  const num_cols = ["Start_Season","Start_Week","End_Season","End_Week"];
  const dropdown_cols = ["Stat", "Position"];
  const stats = ["Passing Yards","Passing TD","Rushing Yards","Rushing TDs","Receptions",
                "Receiving Yards", "Receiving TDS"];
  const positions = ["QB","RB","WR","TE","K"];
  const default_filters =  { Player_Filter_Type: 'Name', Name: 'Enter Player Name'};


  function createFields(filtType, nw) {
    switch(filtType){
      case "Name":
        if(nw){
          columns.push([query_type.split(" ")[1] + "_Filter_Type", query_type.split(" ")[1] + "_Name"]);
          counter += 1;
        }
        return({Filter_Type: query_type.split(" ")[1] + ' Name', [query_type.split(" ")[1] + '_Name']: 'Enter '+ query_type.split(" ")[1] + ' Name'} );
      case "Between Games":
        if(nw){
          columns.push([query_type.split(" ")[1] + "_Filter_Type","Start_Season","Start_Week","End_Season","End_Week"]);
          counter += 1;
        }
        return({[query_type.split(" ")[1] + "_Filter_Type"]: filtType, Start_Season: 2018, Start_Week: 1, End_Season: 2020, End_Week: 1});
      case "Team Name":
        columns.push(["Team_Filter_Type", "Team_Name"]);
        counter += 1;
        return({Team_Filter_Type: 'Team Name', Team_Name: 'Enter Team Name'} );
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
    setInputFields(values);
  }

  const handleChangeDropdownInput = (index, name, event) =>{
    const values = [...inputFields];
    values[index][name] = event.value;
    setInputFields(values);
  }

  const handleChangeNumericInput = (index, name, event) => {
    const values = [...inputFields];
    values[index][name] = event
    setInputFields(values);
    
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("InputFields",inputFields)
  }

  const handleAddFields = () => {
    console.log("add");
    let fieldType = filters_left[query_type][filters_left[query_type].length-1][0];
    setInputFields([...inputFields, createFields(fieldType, true)]);
  }

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
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
    setInputFields(values);
  }

  const handleQueryTypeChange = (event) => {
    fields[query_type] = [...inputFields];
    query_type = event.value ;
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

  const updateFilters = () => {
    let filts = [];
    for(let n=0;n<inputFields.length;n++){
      filts[n] = Filter_Types[query_type];
      for( let i=0; i<n;i++){
        const where = filts[n].indexOf(inputFields[i][query_type.split(" ")[1] + "_Filter_Type"].replace('_',' '));
        if (where > -1) {
          const x = [...filts[n]];
          x.splice(where,1);
          filts[n] = x;
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
    filters_left[query_type] = updateFilters();
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
      console.log(columns[index][n]);
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
        <h1>New Filter</h1>
        <form>
          <div key="query_bar">
            {query_bar()}
          </div>
          { inputFields.map((inputFields, index) => (
            <div key={index}>
              {filters(index)}  
              <IconButton
                onClick = {() => handleRemoveFields(index)}
              >
                <RemoveIcon></RemoveIcon>
              </IconButton>
              <IconButton
                onClick={() => handleAddFields()}
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

