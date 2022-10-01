let fetchAnimes=async()=>{
    let res=await fetch("https://api.jikan.moe/v4/anime");
    let result=await res.json();
    return result;
}

let displayWatchListContent=(watchListData)=>{
    if(watchListData.length!==0){
        let properWatchlistData=[];
    watchListData.forEach(item=>{
        if(!properWatchlistData.includes(item));{
            properWatchlistData.push(item)
        }
    })
    let dataElem=document.getElementById("data");
    dataElem.innerHTML="";
    properWatchlistData.forEach((item,index)=>{
        const colElement = document.createElement("div");
        //setting the class attributes of the div element which we have created
        colElement.setAttribute("class", "col-12 colDiv d-flex align-items=center justify-content-center ms-4");
        //Creating the html required for col element
        colElement.innerHTML=`
        <a href="../AnimeDetail/?title=${item.title}" class="coldivA" id="${item.title}">
        <h3>${index+1}) ${item.title}</h3>
        <div class="form-check category-check d-none ">
         <input class="form-check-input" type="checkbox" value="">
        </div>
        </a>`
        dataElem.append(colElement);
    })
    }
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

let flag=0;
document.getElementById("AddToWatchListInitiator").addEventListener("click",()=>{
    watchListTitles=JSON.parse(localStorage.getItem("realWatchList"));
    if(watchListTitles.length===0){
        alert("There are No Animes in your WatchList!")
    }else{
        if(flag===0){
            document.getElementById("AddToWatchList").removeAttribute("disabled");
            document.querySelectorAll(".category-check").forEach(item=>{
            item.classList.remove("d-none");})  
            flag=1;
        }else{
            document.getElementById("AddToWatchList").setAttribute("disabled","");
            document.querySelectorAll(".category-check").forEach(item=>{
            item.classList.add("d-none");})  
            flag=0;
        }     
    }
})

document.getElementById("AddToWatchList").addEventListener("click",async()=>{
    let watchList=[]
    let items=document.querySelectorAll('input[type=checkbox]:checked');
    if(items.length===0){
        alert("No Animes Selected to remove from Watch list!");
        return;
    }
    items.forEach(item=>{
        watchList.push((item.parentElement.parentElement.id));
    })
    let watchListTitles=[];
    let realWatchList=[];
    if(localStorage.getItem("realWatchList")){
      watchListTitles=JSON.parse(localStorage.getItem("realWatchList"));
    }
    watchListTitles.forEach(item=>{
        if(watchList.includes(item.title)===false){
        realWatchList.push(item);
    }
  })
    alert("Animes removed Successfully from your WatchList!");
    localStorage.setItem("realWatchList",JSON.stringify(realWatchList));
    location.reload();
    displayWatchListContent();
    console.log(realWatchList);
})

let selectCategory=async(event)=>{
    let animes=JSON.parse(localStorage.getItem("realWatchList"));
    let filteredAnimes=animes.filter(item=>{
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
    displayWatchListContent(filteredAnimes);
}
let clearCategory=(event)=>{
    main();
}
let main=async()=>{
    let watchListData=JSON.parse(localStorage.getItem("realWatchList"));
    displayWatchListContent(watchListData);
    addElementsToDropdown(watchListData);
}
main();