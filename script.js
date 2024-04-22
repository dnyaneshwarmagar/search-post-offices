async function getIPAddress() {
    try {
        let data = await fetch("https://api.ipify.org?format=json");

        let response = await data.json();        
        let ip = response.ip;

        return ip;
    } catch (error) {
        console.log('error:', error);
    }

}
async function showIpAddress(){
    let ip = await getIPAddress();
    document.getElementById("ip_span").innerHTML = ip;
}
showIpAddress();

let postOfficeArray = [];

async function getData(ip) {
    try {
        let res = await fetch(`https://ipapi.co/${ip}/json/`);
        let infoData = await res.json();
        return infoData;
    } catch (error) {
        console.log('error:', error);
    }

}

document.getElementById("get_started_btn").addEventListener("click", async () => {
    document.getElementById("container").style.display = "none"
    document.getElementById("onclick_container").style.display = "block";

    let ip = await getIPAddress();
    let infoData = await getData(ip);
    console.log('infoData:', infoData);
    renderInfoData(infoData)
    renderLocationOnMap(infoData);
    let postOffices = await getPostals(infoData);
    postOfficeArray = [...postOffices];
    
    renderPostOffices(postOfficeArray)


})

function renderLocationOnMap({latitude,longitude}){
    let map = document.getElementById("map_frame");
    map.setAttribute("src", `https://maps.google.com/maps?q=${latitude}, ${longitude}&z=15&output=embed`)
    console.log({latitude,longitude});
}

function renderInfoData(infoData){
    let ip_sec_span = document.getElementById("ip_sec_span");
    ip_sec_span.innerHTML = infoData.ip;

    let lat_span = document.getElementById("lat_span");
    lat_span.innerHTML = infoData.latitude;

    let city_span = document.getElementById("city_span");
    city_span.innerHTML = infoData.city;

    let org_span = document.getElementById("org_span");
    org_span.innerHTML = infoData.org;

    let long_span = document.getElementById("long_span");
    long_span.innerHTML = infoData.longitude;

    let reg_sapn = document.getElementById("reg_sapn");
    reg_sapn.innerHTML = infoData.region;

    let host_span = document.getElementById("host_span");
    host_span.innerHTML = infoData.asn;

    let tzone_span = document.getElementById("tzone_span");
    tzone_span.innerHTML = infoData.timezone;
    
    const formattedDateTime = new Date().toLocaleString('en-US', {timeZone: infoData.timezone});
    let dt_span = document.getElementById("dt_span");
    dt_span.innerHTML = formattedDateTime;

    let pin_span = document.getElementById("pin_span");
    pin_span.innerHTML = infoData.postal;
}

async function getPostals({postal}){
    try{
        let response = await fetch(`https://api.postalpincode.in/pincode/${postal} `);
        let data = await response.json();
        console.log('data:', data);
        return data[0].PostOffice;
    }catch(error){
        console.log(error)
    }
}

function renderPostOffices(postOfficeArray){
    let num_span = document.getElementById("num_span");
    num_span.innerHTML = postOfficeArray.length;

    let post_grid_div = document.getElementById("post_grid_div");
    post_grid_div.innerHTML = "";

    postOfficeArray.forEach((office=>{
        let div = document.createElement("div");
        div.setAttribute("id","post_div")
        div.innerHTML = `
        <p>Name: <span>${office.Name}</span></p>
        <p>Branch Type: <span>${office.BranchType}</span></p>
        <p>Delivery Status: <span>${office.DeliveryStatus}</span></p>
        <p>District: <span>${office.District}</span></p>
        <p>Division: <span>${office.Division}</span></p>
        `
        post_grid_div.append(div)
    }))
}

document.querySelector("input").addEventListener("input",(e)=>{
    console.log(e.target.value);
    debounceHandle(e.target.value)
})

function searchStr(str){
 console.log('str:', str)
 let newArray = postOfficeArray.filter((post)=> post.Name.toLowerCase().includes(str.toLowerCase()) || post.BranchType.toLowerCase().includes(str.toLowerCase()));

 renderPostOffices(newArray)
}
let debounceHandle = debounce(searchStr,500)
function debounce(func,delay){
    let timeOutId;
    return (...args)=>{
        clearTimeout(timeOutId);
        timeOutId = setTimeout(()=>{
            func(...args);

        },delay)
    }
}