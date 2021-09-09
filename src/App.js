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

//types of queries allowed
const Query_Types = [['Player','Team'],["Offense","Defense"]];

//current /default query type
let query_type = Query_Types[0][0];
let side = Query_Types[1][0];

//master fields list, used to generate UI
//dictionary, keys = query type, values are dictionaries containing 
//fields for possible searches
let fields = {"Player":[],"Team":[{Team_Filter_Type: 'Name',Name: 'Enter Team Name'}]};

//dictionary, key = query type, value = arrray, index is dropdown index
//value is array of remaining options for filter type
let filters_left = {};

//fields with numeric values
const num_cols = ["Start_Season","Start_Week","End_Season","End_Week", "Threshold"];
let minimums = {"Start_Week":1,"End_Week": 1, "Start_Season":2018, "End_Season": 2018,"Threshold":1};
let maximums = {"Start_Week":17,"End_Week": 17, "Start_Season":2020, "End_Season":2020,"Threshold":32};

function App() {
  console.log("start app");
  //array of filters
  let columns = [];

  //counter for initial startup
  let counter =0;
  
  //Filter types allowed
  const Filter_Types = {"Player":['Name', 'Between Games', 'Stat', 'Position', 'Opponent'], "Team":['Name', 'Between Games','Stat']};
  

  //fields with dropdown values
  const dropdown_cols = ["Stat", "Position", "Top"];
  
  //available options
  const stats = {"Offense": ["Passing Yards","Passing TDs","Rushing Yards","Rushing TDs","Receptions",
                "Receiving Yards", "Receiving TDs"],
                "Defense": ["Passing Yards Against","Passing TDs Against","Rushing Yards Against",
                "Receptions Against","Receiving Yards Against","Receiving TDs Against"]};
  const positions = {"Offense": ["QB","RB","WR","TE","K"],
                    "Defense": ["DE","DT","MLB","OLB","CB","SS","FS"]};
  const top = {"Offense": ["Top","Bottom"],
                "Defense":["Top","Bottom"]};

  //dictionary, key = field type, value = options
  const dropdowns = {"Stat": stats, "Position": positions, "Top": top};

  //default field type
  const default_filters =  { Player_Filter_Type: 'Name', Name: 'Enter Player Name'};


  //input type of filter, 
  //returns row to add to master fields
  const createFields = (filtType, nw) => {
    switch(filtType){
      case "Name":
        if(nw){
          columns.push([query_type + "_Filter_Type", "Name"]);
          counter += 1;
        }
        return({[query_type + "_Filter_Type"]: filtType, Name: 'Enter '+ query_type + ' Name'} );
      case "Between Games":
        if(nw){
          columns.push([query_type + "_Filter_Type","Start_Season","Start_Week","End_Season","End_Week"]);
          counter += 1;
        }
        return({[query_type + "_Filter_Type"]: filtType, Start_Season: 2018, Start_Week: 1, End_Season: 2020, End_Week: 1});
      case "Opponent":
        if(nw){
          columns.push([query_type + "_Filter_Type","Threshold","Stat"]);
          counter += 1;
        }
        return({[query_type + "_Filter_Type"]: filtType, Top: "Top", Threshold:  32, Stat: 'Select Stat'});
      default:
        if(nw){
          columns.push([query_type + "_Filter_Type",filtType]);
          counter += 1;
        }
        return({[query_type + "_Filter_Type"]: filtType, [filtType]: 'Select ' + filtType});
    }
  }

  //connected to UI, when updated refreshes screen,
  //contains currently dispalyed fields
  const [inputFields, setInputFields] = useState([
    default_filters,
  ]);

  //do this when user types in text field (every input, not just submit)
  const handleChangeInput = (index, event) =>{
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;
    filters_left[query_type] = updateFilters(values);
    setInputFields(values);
  }

  //do this when dropdown is selected
  const handleChangeDropdownInput = (index, name, event) =>{
    const values = [...inputFields];
    values[index][name] = event.value;
    filters_left[query_type] = updateFilters(values);
    setInputFields(values);
  }

  //do this when a numeric input is changed
  const handleChangeNumericInput = (index, name, event) => {
    const values = [...inputFields];
    values[index][name] = event
    filters_left[query_type] = updateFilters(values);
    if(values[index]["End_Week"] < values[index]["Start_Week"]){
    }else{
      switch(name){
        case "Start_Season":
          minimums["End_Season"] = event;
          break;
        case "End_Season":
          maximums["Start_Season"] = event;
          break;
        default:
          break;
      }
    }
    if(values[index]["Start_Season"]===values[index]["End_Season"]){
        minimums["End_Week"] = values[index]["Start_Week"];
        maximums["Start_Week"] = values[index]["End_Week"];
    }else{
      minimums["End_Week"] = 1;
      maximums["Start_Week"] = 17;
    }
    setInputFields(values);
  }

  //do this when submit is clicked, currently just prints to console
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("InputFields",inputFields)
  }

  //do this when add button clicked
  //takes index as input to keep track of which options remain
  const handleAddFields = (index) => {
    console.log("add");
    let fieldType = filters_left[query_type][index+1][0];
    let newField = createFields(fieldType, true);
    let values =[...inputFields];
    values.push(newField);
    filters_left[query_type] = updateFilters(values);
    setInputFields(values);
  }

  //do this when remove button clicked
  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    filters_left[query_type] = updateFilters(values);
    setInputFields(values);
  }

  //do this when type of field is changed
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

  //do this when query type is changed
  const handleQueryTypeChange = (event) => {
    fields[query_type] = [...inputFields];
    query_type = event.value ;
    filters_left[query_type] = updateFilters(fields[query_type]);
    setInputFields(fields[query_type]);
  }

  const handleSideChange = (event) => {
    side = event.value ;
    const values = [...inputFields];
    setInputFields(values);
  }

  //helper function, returns all keys,methods,etc for any object
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
  if(columns.length === 0 && query_type==="Player" ){
    columns.push(listAllProperties(inputFields[counter]).slice(0,2));
    counter += 1;
  }

  //updates columns list using master input fields
  const updateColumns = () => {
    let c = [];
    for( let i=0; i<inputFields.length;i++){
      let l = listAllProperties(inputFields[i]).length -12 ;
      c.push(listAllProperties(inputFields[i]).slice(0,l));
    }
    return(c);
  }

  //input master input values,
  //returns array, index = dropdown index, 
  //values = array of remaining options for that dropdown
  const updateFilters = ( values ) => {
    console.log("updating filters...");
    let filts = [];
    for(let n=0;n<= Object.keys(values).length ;n++){
      filts[n] = Filter_Types[query_type];
      for( let i=0; i<n;i++){
        if(typeof values[i][query_type + "_Filter_Type"]=="undefined"){
          console.log("undefined");
        }else{
          const where = filts[n].indexOf(values[i][query_type + "_Filter_Type"].replace('_',' '));
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

  //input index of row, index of field
  //returns html element for field/filter
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
      console.log(columns[index][n]);
      return(
        <Dropdown 
        name={columns[index][n]}
        options={dropdowns[columns[index][n]][side]} 
        value={dropdowns[columns[index][n]][side][0]} 
        onChange = {event => handleChangeDropdownInput(index, columns[index][n], event)}
        />
        );
    } else if(num_cols.includes(columns[index][n])){
        return([
          <label>{columns[index][n].replace('_',' ').replace('Threshold','')}</label>,
          <NumericInput
          min={minimums[columns[index][n]]}
          max={maximums[columns[index][n]]}
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

  //input row of master fields list
  //returns html fields
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

  //top dropdown for types of queries
  const query_bar = () => {
    return(
      [
      <Dropdown 
        name="query_bar"
        options={Query_Types[0]} 
        value={Query_Types[0][0]} 
        onChange = {event => handleQueryTypeChange(event)}
        />,
      <Dropdown 
      name="query_bar2"
      options={Query_Types[1]} 
      value={Query_Types[1][0]} 
      onChange = {event => handleSideChange(event)}
      />
      ]
    )
  }

    //html page returned
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

