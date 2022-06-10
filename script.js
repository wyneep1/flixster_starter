//Global constants
const apiKey =  '0f982157345a90c670c6073ce6eabeaa';
const showMore = document.querySelector('.load-more-movies-btn'); //show more button
const submitFunction = document.querySelector("form"); //movie form
//const movieInfo= `https://api.themoviedb.org/3/movie/{movie_id}api_key=${apiKey}&language=en-US`
console.log("You are here");
const searchInput = document.querySelector("#search-input"); //NEW

const search_api_url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`
let CURRENT_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US`;
//let CURRENT_URL ="https://api.themoviedb.org/3/movie/now_playing?page="+"&language=en-US&api_key="+ apiKey; //GOT IT FROM currentMovies
const reset = document.querySelector('#close-search-btn');

//Let functions
let page = 1;
let searching = false;

 /*reset.addEventListener('click', resetPage);
 function resetPage(){
    searchInput.value = "";
    searching = true;
 }*/

 reset.addEventListener('click', () => {
            searchInput.value = "";
            let wordSearch = searchInput.value;
            if(wordSearch.length == 0){
                resultsArea.innerHTML = '';
                currentMovies();
            }
           //we need to remove the results already displayed

           //we have to find a way to make searchTerm == 0 so that it can tell handleFormSubmit that this happened 
           //searching = true;
         //  if(searching==true){
              // currentMovies
         //  }
        });
let resultsArea = document.querySelector("#movies-grid"); //movie results
//let currentResultsArea = document.querySelector("#current-movies"); //current movies

function searchTerm(){
    return searchInput.value; //NEW
}

function handleFormSubmit(e){
    let wordSearch = searchTerm();
    
    console.log("word is: " + wordSearch);

    e.preventDefault()
    //values = evt.target.movie.value;

   /* if(showMore.classList.contains("hidden")){
        showMore.classList.add("hidden");
    }
    
    */
    
    if(resultsArea){
        resultsArea.innerHTML = '';
    }
    page = 1;

    if(wordSearch.length == 0){
        currentMovies();
    }
    else {
        movieResults(wordSearch);
    }

   // searchHeader.classList.remove("hidden");
  //  searchHeader.innerHTML += `<h4 id="search-header"> Showing results for: ${submitForm.movie.value}`;

}
//event listeners
submitFunction.addEventListener("submit",handleFormSubmit);


async function movieResults(wordSearch){
    console.log("Inside function movieResults - form submitted");
    
    //let API_URL = "https://api.themoviedb.org/3/search/movie?page=" + page +"&language=en-US&api_key=" +apiKey +"&query=" + values;
    const API_URL = search_api_url + wordSearch + `&page=${page}`;
    console.log(`API request: ${API_URL}`); 

    let response = await fetch(API_URL);
    console.log("response is:", response);
    let responseData = await response.json();

   //showMore.classList.remove("hidden");
    console.log("responseData is:", responseData);
    displayResults(responseData);
}

function displayResults(data){
    data.results.forEach((img)=>{
        if(img.poster_path == null){
            return;
        }
        resultsArea.innerHTML+=`
        <div class="movie-card">
        <img src = "https://image.tmdb.org/t/p/original${img.poster_path}" class=movie-poster alt="movie poster" />
        <p id="movie-title">${img.title}</p>
        <p id="movie-votes">Votes: ${img.vote_average}</p>
        </div>
        `;
    });
    
    if(page == data.total_pages) {
        showMore.classList.add("hidden");
    } else{
        showMore.classList.remove("hidden");
    }
    
}

 async function moreResults() {
    page+=1;
    //offset = pageNum * limit;
    //showMore.classList.add("hidden");
        //movieResults(evt);
       // currentMovies(evt);
       let word = searchTerm();
       const api_path = (word.length > 0) ? search_api_url + word + `&page=${page}`
       : CURRENT_URL + `&page=${page}`;

      console.log(`Make request to: ${api_path}`);
       const responseData = await fetch(api_path).then(async (res) =>{
           return await res.json();
       });
       displayResults(responseData);

}

async function currentMovies(){
    page=1;
    console.log("Inside function movieResults - form submitted");
    const apiUrl = CURRENT_URL + `&page=${page}`;

   console.log(`Make api request: ${apiUrl}`); 
    let response = await fetch(apiUrl);
    let responseData = await response.json();
    displayResults(responseData);
}

//showMore event listener
showMore.addEventListener("click", moreResults);

//window onload function
window.onload = currentMovies;


//for pop up feature, put an event listener "click" on the movie-poster and then display the pop up once clicked