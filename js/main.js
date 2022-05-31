async function readfile(input)
{ 
  transcriptEl=document.getElementById("transcript")
    
    
    let file = input.files[0];
  
    let reader = new FileReader();
  
    reader.readAsBinaryString(input.files[0]);
  
    reader.onload = function() {
      //console.log(reader.result);
    };
  
    reader.onerror = function() {
      console.log(reader.error); 
    }

var audio_file_path = './Clear-Ab-1.wav';

// loading audio file as fs.ReadStream object
var audio_file = file;

// creating a form data object to hold the file for the HTTP POST request
form_data = new FormData();
form_data.append('file', input.files[0]);

upload(form_data);
};


var transcripts = []
var sentiments = []
var scores = []

function upload(form_data)
{
  // using Axios fot the HTTP POST request
const res = axios.post('https://athena-a6clm7lhrq-oa.a.run.app/classify', form_data).then(res => {
  console.log("Successfully sent");
  console.log("Status Code: " + res.status);
  console.log("Body: ", res.data[0]); // MCIT API returns a JSON object which looks like this: {'transcript' : "الحمدلله"}
  for(let i=0;i<res.data.length;i++)
  {
    transcripts.push(res.data[i].Transcript) 
    sentiments.push(res.data[i].Sentiment) 
    scores.push(res.data[i].Score) 
  }
 
  for(let j=0;j<5;j++)
  {var k=0
     k+=1
    document.getElementById("trans").textContent="Transcript= " + res.data[0].Transcript
  		document.getElementById("senti").textContent="Sentiment= " + res.data[0].Sentiment
  		document.getElementById("Score").textContent="Score= " + res.data[0].Score + " " + j
      document.getElementById("count").textContent="count= " + k
      console.log(k)
      
  }
  // document.getElementById("trans").textContent="Transcript= " + res.data[i].Transcript
  // 		document.getElementById("senti").textContent="Sentiment= " + res.data[i].Sentiment
  // 		document.getElementById("Score").textContent="Score= " + res.data[i].Score
}).catch(err => {
  console.log("Error: " + err);
})

};

function popup(){
  alert("Your file has been sucessfully uploaded, Please wait for the analysis");
  var target = document.getElementById("load");
  target.textContent= "Your file is being analized"
}


//text upload
function upload_text()
{
  const transcript_man = document.getElementById("manual-trans");
  text={"text":transcript_man.value}
  console.log(transcript_man.value)
  const myJSON = JSON.stringify(text);
  console.log(myJSON)
  // using Axios fot the HTTP POST request
const res = axios.post('https://athena-a6clm7lhrq-oa.a.run.app/classify',myJSON ).then(res => {
  console.log("Successfully sent");
  console.log("Status Code: " + res.status);
  console.log("Body: ", res.data[0]); // MCIT API returns a JSON object which looks like this: {'transcript' : "الحمدلله"}
  document.getElementById("trans-txt").textContent="Transcript= " + res.data[0].Transcript
  document.getElementById("senti-txt").textContent="Sentiment= " + res.data[0].Sentiment
  document.getElementById("Score-txt").textContent="Score= " + res.data[0].Score
}).catch(err => {
  console.log("Error: " + err);
})

};

