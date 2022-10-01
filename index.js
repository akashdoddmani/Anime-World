let fetchAnimes=async()=>{
    let res=await fetch("https://api.jikan.moe/v4/anime");
    let result=await res.json();
    return result;
}

let addElementsToDropdown=(result)=>{
    let repeatedGenres=[];
    result.forEach(item=>{
        item.genres.forEach(innerItem=>{
            repeatedGenres.push(innerItem.name)
        })
    })
    genres=[];
    repeatedGenres.forEach(item=>{
        if(!genres.includes(item)){
            genres.push(item);
        }
    })
    let categorySelect=document.getElementById("category-select");
    categorySelect.innerHTML=`<option disabled selected value="">Select Category</option>`;
    genres.forEach(item=>{
        categorySelect.innerHTML+=`<option>${item}</option>`
    })
}
// console.log(await fetchAnimes());
let addAnimeToDOM=(result)=>{
    // TODO: MODULE_ADVENTURES
    // 1. Populate the Anime Cards and insert those details into the DOM
    let rowDiv=document.querySelector('#data');
    rowDiv.innerText="";
    result.forEach((item)=>{
      const colDiv = document.createElement("div");
      colDiv.setAttribute("class", "col-md-6 col-lg-4 col-xl-4 mb-4");
      const cardHTML =
      `<a class="anime-card-link" href="/AnimeDetail/?title=${item.title}" id="${item.mal_id}">
      <div class="anime-card">
        <img class="img-responsive" src="${item.images.jpg.image_url}" alt="${item.title}">
        <div class="form-check category-banner d-none">
         <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
         <label class="form-check-label" for="flexCheckDefault">
         </label>
        </div>
         <div class="anime-card-text text-center w-100 mt-3 ">
             <div class="d-block d-flex justify-content-between  pl-4 pr-4 title">
               <h4 class='fs-6'>Title:</h4>
               <span>${item.title}</span>    
             </div>
             <div class="d-block d-flex flex-wrap justify-content-between  pl- pr-4 rating">
             <h4 class='fs-6'>Rating:</h4>       
             <span>${item.rating}</span>
             </div>
         </div>
       </div>
     </a>`;
    colDiv.innerHTML=cardHTML;
    rowDiv.append(colDiv);
    })
  }

let flag=0;
document.getElementById("AddToWatchListInitiator").addEventListener("click",()=>{
        if(flag===0){
            document.getElementById("AddToWatchList").removeAttribute("disabled");
            document.querySelectorAll(".category-banner").forEach(item=>{
            item.classList.remove("d-none");})  
            flag=1;
        }else{
            document.getElementById("AddToWatchList").setAttribute("disabled","");
            document.querySelectorAll(".category-banner").forEach(item=>{
            item.classList.add("d-none");})  
            flag=0;
        }     
})
 

document.getElementById("AddToWatchList").addEventListener("click",async()=>{
    let watchList=[]
    let items=document.querySelectorAll('input[type=checkbox]:checked');
    if(items.length===0){
        alert("No Animes Selected to add to Watch list!");
        return;
    }
    items.forEach(item=>{
        watchList.push(parseInt(item.parentElement.parentElement.parentElement.id));
    })
    let result=await fetchAnimes();
    let resultedWatchlist= result.data.filter(item=>{
       return watchList.includes(item.mal_id)
    })
    let watchListTitles=[];
    let realWatchList=[];
    if(localStorage.getItem("realWatchList")){
      watchListTitles=JSON.parse(localStorage.getItem("realWatchList"));
      realWatchList=JSON.parse(localStorage.getItem("realWatchList"));
      watchListTitles=watchListTitles.map(item=>item.title);
    }
    let flag=0;
    resultedWatchlist.forEach(item=>{
      if(!watchListTitles.includes(item.title)){
        realWatchList.push(item);
        flag=1;
      }
  })
  alert("Animes added Successfully to your WatchList!");
  localStorage.setItem("realWatchList",JSON.stringify(realWatchList));
  location.reload();
})


document.getElementById("heroInput").addEventListener("input",async (e)=>{
    let animes=await fetchAnimes();
    let filteredAnimes=animes.data.filter(item=>{
      let titl=item.title.toLowerCase();
      let enteredValue=e.target.value.toLowerCase();
      return titl.includes(enteredValue);
    })
    document.getElementById("data").innerHTML="";
    if(filteredAnimes.length!==0){
        addAnimeToDOM(filteredAnimes);
    }
    else{
      document.getElementById("data").innerHTML=`<h3 class="alert alert-secondary" role="alert" id="h3Color">Sorry!, Couldn't find the Anime you're searching for</h3>`;
    }
})

let selectCategory=async(event)=>{
    let animes=await fetchAnimes();
    let filteredAnimes=animes.data.filter(item=>{
      let flag=0;
      let Selectedgen=event.target.value;
      item.genres.forEach(itm=>{
        if(itm.name===Selectedgen){
            flag=1;
        }
      })
      if(flag>0){
        return item;
      }
    })
    addAnimeToDOM(filteredAnimes);
}

let clearCategory=(event)=>{
    main();
}

 let main=async()=>{
    let result=await fetchAnimes();
    // console.log(result.data);
    addAnimeToDOM(result.data);
    addElementsToDropdown(result.data);
  }
  main();