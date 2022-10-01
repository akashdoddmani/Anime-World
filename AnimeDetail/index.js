let fetchAnimes=async()=>{
    let res=await fetch("https://api.jikan.moe/v4/anime");
    let result=await res.json();
    return result;
}

let getAnimeTitle=()=>{
    let search=window.location.search;
    let title = search.substring(search.lastIndexOf('=') + 1).replaceAll("%20"," ");
    return title;
}

let getAnimeData=(data,title)=>{
    let animeData=data.filter(item=>{
        return item.title===title;
    })
    return animeData
}

document.getElementById("addToWatchListFromAnimeDetail").addEventListener("click",async(e)=>{
    let realWatchList=[];
    if(!localStorage.getItem("realWatchList")){
        realWatchList=[];
    }
    else{
        realWatchList=JSON.parse(localStorage.getItem("realWatchList"));
    }
    let res=await fetchAnimes();
    let title=getAnimeTitle();
    let tempArr=res.data.filter(item=>{
            return item.title===title;
    })
    let temArrayOfTitles=realWatchList.map(item=>{
        return item.title;
    })
    let flag=0;
    tempArr.forEach(item => {
        if(!temArrayOfTitles.includes(item.title)){
            realWatchList.push(item);
            flag=1;
        }
    });
    if(flag===0){
        alert("This Anime is already in your Watch List!")
    }else{
        alert("Anime added Successfully to your WatchList!");
    }
    localStorage.setItem("realWatchList",JSON.stringify(realWatchList));
})


let displayAnimeImages=(animeData)=>{
    document.getElementById("anime-name").innerHTML=`<h2>${animeData.title}</h2>`
    document.getElementById("anime-subtitle").innerHTML=`<h4>${animeData.status}</h4>`
    document.getElementById("photo-gallery").innerHTML=`
    <img class="animeImage" src=${animeData.images.jpg.large_image_url}>`
    document.getElementById("anime-content").innerHTML=`
    <p>Season: ${animeData.season}, Year: ${animeData.year}</p>
    <p>Episodes: ${animeData.episodes}</p>
    <p>Aired Date: ${animeData.aired.string}
    <p>Duration: ${animeData.duration}</p>
    <p>Genres: ${animeData.genres[0].name}</p>
    <p>Synopsis: ${animeData.synopsis}</p>
    <p>Background: ${animeData.background}</p>
    <p>Trailer: Click <a href="${animeData.trailer.url}">here</a> to watch the trailer</p>
    `
    // console.log(animeData)
}

let main=async()=>{
    let res=await fetchAnimes();
    let title=getAnimeTitle();
    let animeData=getAnimeData(res.data,title);
    displayAnimeImages(animeData[0]);
}
main();