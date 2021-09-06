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

let player_fields;
let team_fields = [{Team_Filter_Type: 'Team Name',Team_Name: 'Enter Team Name'}];
const Query_Types = ['By Player','By Team'];
let query_type = Query_Types[0];

function App() {
  console.log("start app");
  let columns = [];
  let counter;
  counter=0;
  
  const Player_Filter_Types = ['Player Name', 'Between Games', 'Stat', 'Position'];
  const Team_Filter_Types = ['Team Name', 'Between Games','Stat'];
  const num_cols = ["Start_Season","Start_Week","End_Season","End_Week"];
  const dropdown_cols = ["Stat", "Position"];
  const stats = ["Passing Yards","Passing TD","Rushing Yards","Rushing TDs","Receptions",
                "Receiving Yards", "Receiving TDS"];
  const positions = ["QB","RB","WR","TE","K"];


  function createFields(filtType, nw) {
    switch(filtType){
      case "Player Name":
        if(nw){
          columns.push(["Player_Filter_Type", "Player_Name"]);
          counter += 1;
        }
        return({Filter_Type: 'Player Name', Player_Name: 'Enter Player Name'} );
      case "Between Games":
        if(nw){
          if(query_type==="By Player"){
            columns.push(["Player_Filter_Type","Start_Season","Start_Week","End_Season","End_Week"]);
          }else{
            columns.push(["Team_Filter_Type","Start_Season","Start_Week","End_Season","End_Week"]);
          
          }
          counter += 1;
        }
        if(query_type==="By Player"){
          return({Player_Filter_Type: 'Between Games',Start_Season: 2018, Start_Week: 1, End_Season: 2020, End_Week: 1});
        }else{
          return({Team_Filter_Type: 'Between Games',Start_Season: 2018, Start_Week: 1, End_Season: 2020, End_Week: 1});
        }
      case "Team Name":
        columns.push(["Team_Filter_Type", "Team_Name"]);
        counter += 1;
        return({Team_Filter_Type: 'Team Name', Team_Name: 'Enter Team Name'} );
      default:
        if(nw){
          if(query_type==="By Player"){ 
            columns.push(["Player_Filter_Type",filtType]);
          }else{
            columns.push(["Team_Filter_Type",filtType]);
          }
          counter += 1;
        }
        if(query_type==="By Player"){ 
          return({Player_Filter_Type: filtType, [filtType]: 'Select Position'});
        }else{
          return({Team_Filter_Type: filtType, [filtType]: 'Select Position'});
        }
    }
  }

  
  const [inputFields, setInputFields] = useState([
    { Player_Filter_Type: 'Player Name', Player_Name: 'Enter Player Name'},
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
    let fieldType;
    if(query_type==="By Player"){
      fieldType = player_filters_left[player_filters_left.length-1][0];
    }else{
      fieldType = team_filters_left[team_filters_left.length-1][0];
    }
    setInputFields([...inputFields, createFields(fieldType, true)]);
    //handleTypeChange(index,fieldType);
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
    switch(query_type){
      case "By Player":
        player_fields =  [...inputFields];
        break;
      case "By Team":
        console.log(team_fields)
        console.log(inputFields)
        //team_fields = [...inputFields];
        break;
      default:
        break;
    }
    query_type = event.value ;
    switch(query_type){
      case "By Player":
        setInputFields(player_fields);
        console.log(inputFields);
        break;
      case "By Team":
        setInputFields(team_fields);
        console.log(inputFields);
        break;
      default:
        break;
    }
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
  if(columns.length === 0 && query_type==="By Player" ){
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
  let player_filters_left = [];
  let team_filters_left = [];
  function updateFilters(){
    let filts = [];
    switch(query_type){
      case "By Player":
        for(let n=0;n<inputFields.length;n++){
          filts[n] = Player_Filter_Types;
          for( let i=0; i<n;i++){
            const where = filts[n].indexOf(inputFields[i]["Player_Filter_Type"].replace('_',' '));
            if (where > -1) {
              const x = [...filts[n]];
              x.splice(where,1);
              filts[n] = x;
            }
          }
        }
        break;
      case "By Team":
        for(let n=0;n<inputFields.length;n++){
          filts[n] = Team_Filter_Types;
          for( let i=0; i<n;i++){
            const where = filts[n].indexOf(inputFields[i]["Team_Filter_Type"].replace('_',' '));
            if (where > -1) {
              const x = [...filts[n]];
              x.splice(where,1);
              filts[n] = x;
            }
          }
        }
        break;
      default:
        break;
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
    if(query_type==="By Player"){
      player_filters_left= updateFilters();
    }else{
      team_filters_left= updateFilters();
    }
    
    if(columns[index][n]==="Player_Filter_Type"){
      return(
        <Dropdown 
        name={columns[index][n]}
        options={player_filters_left[index]} 
        value={player_filters_left[index][0]} 
        onChange = {event => handleTypeChange(index, event)}
        />
        );
    } else if(columns[index][n]==="Team_Filter_Type"){
      return(
        <Dropdown 
        name={columns[index][n]}
        options={team_filters_left[index]} 
        value={team_filters_left[index][0]} 
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
    console.log(columns);
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

  console.log(inputFields);
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

