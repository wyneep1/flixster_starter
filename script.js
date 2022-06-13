//Global constants
const apiKey =  '0f982157345a90c670c6073ce6eabeaa';
const showMore = document.querySelector('.load-more-movies-btn'); //show more button
const submitFunction = document.querySelector("form"); //movie form
console.log("You are here");
const searchInput = document.querySelector("#search-input"); 
const search_api_url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`
const CURRENT_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US`;
const reset = document.querySelector('#close-search-btn');
//const mainDiv = document.querySelector(".main");
const popUp = document.querySelector(".pop-up");
//Let functions
let page = 1;
let resultsArea = document.querySelector("#movies-grid"); //movie results

//function to remove results using clear button
 reset.addEventListener('click', () => {
            searchInput.value = "";
            let wordSearch = searchInput.value;
            if(wordSearch.length == 0){
                resultsArea.innerHTML = '';
                currentMovies();
            }
           //we need to remove the results already displayed
        });

function searchTerm(){
    return searchInput.value; 
}

function handleFormSubmit(e){
    let wordSearch = searchTerm();
    
    console.log("word is: " + wordSearch);

    e.preventDefault()
    
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

}
//event listeners
submitFunction.addEventListener("submit",handleFormSubmit);

//function for getting results for using search bar 
async function movieResults(wordSearch){
    console.log("Inside function movieResults - form submitted");
    
    const API_URL = search_api_url + wordSearch + `&page=${page}`;
    console.log(`API request: ${API_URL}`); 

    let response = await fetch(API_URL);
    console.log("response is:", response);
    let responseData = await response.json();

    console.log("responseData is:", responseData);
    displayResults(responseData);
}
//function for displaying results both searched and trending
function displayResults(data){
    data.results.forEach((img)=>{
        if(img.poster_path == null){
            return;
        }//I must figure out how to deal with img.id
        resultsArea.innerHTML+=`
        <div class="movie-card" id=${img.id}"> 
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

 async function moreResults(e) {
     e.preventDefault(); //do we need this? new
    page+=1;
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
   
    console.log("response is: " + responseData);
    displayResults(responseData);
}


resultsArea.addEventListener('click', movieInformation); //click function for movie poster

async function movieInformation(e){
    let obj = e.target.id;
    if(obj == ''){
        obj = e.target.parentNode.id;
        console.log("Object is" + obj);
    }
    else{

    }
    if(obj != 'movies-grid'){
        let trailerUrl = `https://api.themoviedb.org/3/movie/${obj}?api_key=${apiKey}`
        let response = await fetch(trailerUrl);
        trailerUrl =`https://api.themoviedb.org/3/movie/${obj}/videos?api_key=${apiKey}`;
        let videoInfo = await fetch(trailerUrl);
        console.log("video info is: " + trailerUrl);
        let videoInfo2 = await videoInfo.json();
        let videoLink = null;

        if(videoInfo2['results'].length > 0){
            videoLink = videoInfo2['results'][0]['key']
        }
        displayPopUp(await response.json(), videoLink);
    }

}

async function displayPopUp(movie, vidId){
    console.log("movie has been clicked on");
    popUp.innerHTML = `
        <div class ="mode">
        <button id="close-pop-up"> Close </button>
        </div>
        <h2> ${movie['title']} </h2>
        <iframe src="https://www.youtube.com/embed/${vidId}" frameborder="0" allowfullscreen></iframe>
        <h2><strong> Watch Trailer</strong></h2>
        <h3> Synopsis: ${movie['overview']}</h3>
        <h3> Runtime: ${movie['runtime']}mins</h3>
        <h3> <strong>release date</strong>: ${movie['release_date']}</h3>
    `;
   document.getElementById('close-pop-up').addEventListener('click', removeElement);

}

function removeElement(e){
    popUp.innerHTML = '';
}

//showMore event listener
showMore.addEventListener("click", moreResults);

//window onload function
window.onload = currentMovies;


//for pop up feature, put an event listener "click" on the movie-poster and then display the pop up once clicked