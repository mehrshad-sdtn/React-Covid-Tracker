import React, { useEffect, useState } from "react";
import './Nav.css';
import './CovidData.css'


function CovidData() {

const [userInput, setUserInput] = useState("");
const [history, setHistory] = useState([]);
const [query, setQuery] = useState("");
const [top5, setTop5] = useState([]);
const [error, setError] = useState(0);


const handleSearch = (e) => {
	setUserInput(e.target.value);
};



const getTopFive = (dataArray) => {
  console.log(dataArray);
  dataArray.forEach(element => {
    setTop5(top5 => [...top5, element]);
    //this function adds array elements to top5 list
      
  });

  

}

const handleSubmit = (props) => {
    
    if (userInput !== "") {
        props.preventDefault();
	    fetch(`https://corona.lmao.ninja/v2/countries/${userInput}?yesterday=true&strict=true&query`)
	    .then((res) => res.json())
	    .then((data) => {
            console.log(data)
            if ('message' in data) {
               setError(1); //if data containes a message we have error, set state error

            }
            else{
               setError(0); 
               setTop5([]); //reset top5
               setTop5([data]); //add current country to top5 (we need only one though)
               //add the current searched item to history array
               setHistory(history => [...history, userInput]);
            }
	});

    }
    else{
        props.preventDefault();
	    fetch(`https://corona.lmao.ninja/v2/countries?yesterday=true&sort=${query}`)
	    .then((res) => res.json())
	    .then((data) => {
            setError(0); //reset error state
            setTop5([]); //reset array
	    	getTopFive(data.slice(0, 5));
            //select and pass top 5 countires to the function
	});
        

    }
	
   
};

const handleRadio = (e) => {
    //get radio button input and set query for fetching top 5 countries
    setQuery(e.target.value);
}

const clearHistory = () => {
    setHistory([]);
}

return (
    
	<div className="covidData">
     
      <div class="topnav">
        <a class="active">SBU Covid</a>
        <form onSubmit={handleSubmit}>
  	 	  {/* input county name */}
  	 	  <input onChange={handleSearch} class="subinput" placeholder="Enter Country Name" />
  	 	  <br />
  	 	  <button class="subbtn" type="submit">Go</button>
          
            <div className="radios">
              <label className="radiobtn">
                <input
                  onChange={handleRadio}
                  type="radio"
                  name="select"
                  value="todayCases"/>
                    <span>Today Cases</span>
              </label>

              <label className="radiobtn">
                <input
                  onChange={handleRadio}
                  type="radio"
                  name="select"
                  value="todayDeaths"/>
                    <span>Today Deaths</span>
              </label>

              <label className="radiobtn">
                <input
                  onChange={handleRadio}
                  type="radio"
                  name="select"
                  value="recovered"/>
                    <span>Today Recovered</span>
              </label>

            </div>
             
          
  	    </form>
        

       
      </div>
      <div className="flex">
            {/* Showing the details of the country */}
            <div className="covidData__search__history">
           <p>Search History</p>
           <ol>
               {history.map((item) => {
                   if (item !== undefined)
                     return (<li><span>{item}</span></li>);
                })
               }
           </ol>
           <button  onClick={clearHistory} className="clearbtn"> Clear </button>
         
          </div>
            <ul>
                 {top5.map((item) => {
                     if (error === 0){
                        return(
                           <div className="covidData__country__info">
                               <p className="country">{item["country"]} </p>
                               <div className="leftside">
                                  <p className="parag">Cases <br/> {item["cases"]}</p>
                                  <p className="parag">Today Cases <br/> {item["todayCases"]}</p>
                               </div>
                
                               <div className="rightside">
                                  <p className="parag">Today Deaths <br/> <span className="death">{item["todayDeaths"]}</span></p>
                                  <p className="parag" > Today Recovered <br/> <span className="recover">{item["recovered"]}</span></p>
                     
                               </div>
                           
                           </div>
       
                        );
                    }
                    else{
                        //error case
                        return <div className="error">Country not found or doesn't have any cases</div>
                    }
                  })
                 }
            </ul>
          
      </div>

	  
            
  
       
	    </div>
);
}

export default CovidData;
