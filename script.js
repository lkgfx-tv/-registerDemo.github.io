
let buttonApp = document.getElementById("buttonApp")
let country= document.getElementById("countries")
let name= document.getElementById("name")
let email= document.getElementById("email")
let phone= document.getElementById("phone")
let jobTitle= document.getElementById("jobTitle")
let company= document.getElementById("company")
let appName=document.getElementById("appName")
let copy= document.getElementById("copy")
let loading=document.getElementById("loading")
let  credentials= btoa("lesliekajomovitz@gmail.com" + ":" + "cybulalau26");
let data={}
let imgBg= document.getElementById('imgBg')

let registeruser=async()=>{
    data={
      name:name.value, 
      email:email.value, 
      appUrl:'1', 
      country:country.value, 
      phone:phone.value,
      jobTitle:jobTitle.value,
      company:company.value
    }
    let url='https://stormdemodb.herokuapp.com/users'
    let returnedData={data:{}, success:false}
    await fetch(url, {
      headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
    },
      method: "POST",
      body: JSON.stringify(data)
    })
    .then(response => response.json()) 
    .then(json => {
      if(!json.error)returnedData={data:json, success:true}
      else returnedData={error:json.error, success:false}
    })
    .catch((err) => {
     returnedData={error:err.message, success:false}
    });
    return returnedData
}
let updateUrlInDb=async(appUrl, dataInfo)=>{
    let data={"id":dataInfo._id, "appUrl":appUrl}
    let url='https://stormdemodb.herokuapp.com/users/appUrl'
    let returnedData={}
    await fetch(url, {
      headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
    },
      method: "PATCH",
      body: JSON.stringify(data)
    })
    .then(response => response.json()) 
    .then(json => returnedData=json)
    .catch(err => {console.log(err)});
    return returnedData
}

let createShareUrl=async (url,data)=>{
    var requestURL = "https://app.singular.live/apiv1/shareurls";
    var requestBody = {
        "url": url
    }
   let shareUrl= await createAppRequest(requestURL, credentials, requestBody,"POST");
   return shareUrl
  
}
let createAppRequest=async(url, auth, body, type) =>{
    let  returnedData
    var options;
    options = {
      method: type,
      mode: "cors",
      headers: {
        Authorization: "Basic " + auth,
        "content-type": "application/json"
      },
      body: JSON.stringify(body)
    };
  
    await fetch(url, options)
      .then(httpResponse =>  httpResponse.json())
      .then(async(json) => returnedData=json)
      .catch(err => {console.log("ERROR: " + err)});
    return returnedData
}
let renameAppInstance = async(appInstanceId)=>{
  var requestURL = "https://app.singular.live/apiv1/appinstances/"+appInstanceId+"/metadata";
  //find me
  let appName= appName.value+"'s control app"
  var requestBody = {
    "name": appName,
    
  };
  let renamedApp= await createAppRequest(requestURL, credentials, requestBody,"PUT");
  return renamedApp
  
}
let createControlApp=async() =>{
    var requestURL = "https://app.singular.live/apiv1/appinstances/766313/duplicate";
    var requestBody = {
      folder: "5aec1f46-17b9-4ce2-9e23-1969a7b5888d"
    };
    let duplicatedApp =await createAppRequest(requestURL, credentials, requestBody,"POST");
    return duplicatedApp
}

  
let createApp=async()=>{
  loading.style.display='block'
  let registUser= await registeruser()
  if(registUser.success){
    let controlApp= await createControlApp()
    let renamedApp= await renameAppInstance(controlApp.id)
    let shareUrl = await createShareUrl('/app/'+controlApp.id+'/control')
    let updatedUrl="https://app.singular.live/control/"+shareUrl.token
    await updateUrlInDb(updatedUrl, registUser.data)
    loading.style.display='none'
    copy.style.display='block'
    document.getElementById('url').innerHTML=updatedUrl
  }
  else{
    loading.style.display='none'
    alert(registUser.error)
  }

}
let copyAppLinkToClipboard=()=>{
  var text = document.getElementById('url').innerHTML
  navigator.clipboard.writeText(text).then(function() {
  console.log('Async: Copying to clipboard was successful! '+ document.getElementById('url').innerHTML);
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}
buttonApp.addEventListener("click", createApp);
copy.addEventListener("click", copyAppLinkToClipboard);
 

