window.LogData =function readfile(input)
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

// using Axios fot the HTTP POST request
const res = axios.post('https://test-athena1.herokuapp.com/uploadfile/', form_data).then(res => {
    console.log("Successfully sent");
    console.log("Status Code: " + res.status);
    console.log("Body: ", res.data.Transcript); // MCIT API returns a JSON object which looks like this: {'transcript' : "الحمدلله"}
    document.getElementById("transcript").textContent=res.data.Transcript
}).catch(err => {
    console.log("Error: " + err);
})

};

