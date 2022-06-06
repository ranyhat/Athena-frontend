
async function readfile(input) {
  transcriptEl = document.getElementById("transcript");

  form_data = new FormData();
  form_data.append("file", input.files[0]);

   upload_file(form_data)
}

var transcripts = [];
var sentiments = [];
var scores = [];

function upload_file(form_data) {
    // using Axios fot the HTTP POST request
    const res = axios
      .post("https://athena-a6clm7lhrq-oa.a.run.app/audio", form_data)
      .then((res) => {
        console.log("Successfully sent");
        console.log("Status Code: " + res.status);
        console.log("Body: ", res.data[0]); // MCIT API returns a JSON object which looks like this: {'transcript' : "الحمدلله"}
        for (let i = 0; i < res.data.length; i++) {
          transcripts.push(res.data[i].Transcript);
          sentiments.push(res.data[i].Sentiment);
          scores.push(res.data[i].Score);
        }
        
        //remove_icon


        for (let j = 0; j < 5; j++) {
          var k = 0;
          k += 1;
          document.getElementById("trans").textContent =
            "Transcript= " + res.data[0].Transcript;
          document.getElementById("senti").textContent =
            "Sentiment= " + res.data[0].Sentiment;
          document.getElementById("Score").textContent =
            "Score= " + res.data[0].Score + " " + j;
          document.getElementById("count").textContent = "count= " + k;
          console.log(k);
        }
        // document.getElementById("trans").textContent="Transcript= " + res.data[i].Transcript
        // 		document.getElementById("senti").textContent="Sentiment= " + res.data[i].Sentiment
        // 		document.getElementById("Score").textContent="Score= " + res.data[i].Score
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  
}

function popup() {
  alert(
    "Your file has been sucessfully uploaded, Please wait for the analysis"
  );
}

//text upload
function upload_text() {
  const transcript_man = document.getElementById("manual-trans");
  text = { text: transcript_man.value };
  console.log(transcript_man.value);
  const myJSON = text;
  console.log(myJSON);
  // using Axios fot the HTTP POST request
  const res = axios
    .post("https://athena-a6clm7lhrq-oa.a.run.app/text", myJSON)
    .then((res) => {
      console.log("Successfully sent");
      console.log("Status Code: " + res.status);
      console.log("Body: ", res.data[0]); // MCIT API returns a JSON object which looks like this: {'transcript' : "الحمدلله"}
      document.getElementById("trans-txt").textContent =
        "Transcript= " + res.data[0].Text;
      document.getElementById("senti-txt").textContent =
        "Sentiment= " + res.data[0].Sentiment;
      document.getElementById("Score-txt").textContent =
        "Score= " + res.data[0].Score;
    })
    .catch((err) => {
      console.log("Error: " + err);
    });
}

//highlighting the code snippets
document.addEventListener("DOMContentLoaded", (event) => {
  document.querySelectorAll("pre code").forEach((el) => {
    hljs.highlightElement(el);
  });
});

function switchNode() {
  //highlighting the code snippets
  document.addEventListener("DOMContentLoaded", (event) => {
    document.querySelectorAll("pre code").forEach((el) => {
      hljs.highlightElement(el);
    });
  });
}

function email() {
  const first = document.getElementById("firstName").value;
  const last = document.getElementById("lastName").value;
  const mail = document.getElementById("emailInfo").value;

  console.log(first);
  console.log(last);
  console.log(mail);
  pk = {
    first_name: first,
    last_name: last,
    e_mail: mail,
  };
  console.log(pk);
  const myJSON = pk;

  const res = axios
    .post("https://athena-a6clm7lhrq-oa.a.run.app/email", myJSON)
    .then((res) => {
      console.log("Successfully sent");
      console.log("Status Code: " + res.status);
    })
    .catch((err) => {
      console.log("Error: " + err);
    });
}
