var msg_box = document.getElementById("msg_box"),
  button = document.getElementById("button"),
  canvas = document.getElementById("canvas"),
  lang = {
    mic_error: "Error accessing the microphone", //Ошибка доступа к микрофону
    press_to_start: "Press to start recording", //Нажмите для начала записи
    recording: "Recording", //Запись
    play: "Play", //Воспроизвести
    stop: "Stop", //Остановить
    download: "Download", //Скачать
    upload: "Upload",
    use_https:
      "This application in not working over insecure connection. Try to use HTTPS",
  },
  time;

msg_box.innerHTML = lang.press_to_start;

if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function (constrains) {
    var getUserMedia =
      navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!getUserMedia) {
      return Promise.reject(
        new Error("getUserMedia is not implemented in this browser")
      );
    }

    return new Promise(function (resolve, reject) {
      getUserMedia.call(navigator, constrains, resolve, reject);
    });
  };
}

if (navigator.mediaDevices.getUserMedia) {
  var btn_status = "inactive",
    mediaRecorder,
    chunks = [],
    audio = new Audio(),
    mediaStream,
    audioSrc,
    type = {
      type: "audio/ogg,codecs=opus",
    },
    ctx,
    analys,
    blob;

  button.onclick = function () {
    if (btn_status == "inactive") {
      start();
    } else if (btn_status == "recording") {
      stop();
    }
  };

  function parseTime(sec) {
    var h = parseInt(sec / 3600);
    var m = parseInt(sec / 60);
    var sec = sec - (h * 3600 + m * 60);

    h = h == 0 ? "" : h + ":";
    sec = sec < 10 ? "0" + sec : sec;

    return h + m + ":" + sec;
  }

  function start() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        button.classList.add("recording");
        btn_status = "recording";

        msg_box.innerHTML = lang.recording;

        if (navigator.vibrate) navigator.vibrate(150);

        time = Math.ceil(new Date().getTime() / 1000);

        mediaRecorder.ondataavailable = function (event) {
          chunks.push(event.data);
        };

        mediaRecorder.onstop = function () {
          stream.getTracks().forEach(function (track) {
            track.stop();
          });

          blob = new Blob(chunks, type);
          audioSrc = window.URL.createObjectURL(blob);

          audio.src = audioSrc;

          chunks = [];
        };
      })
      .catch(function (error) {
        if (location.protocol != "https:") {
          msg_box.innerHTML = lang.mic_error + "<br>" + lang.use_https;
        } else {
          msg_box.innerHTML = lang.mic_error;
        }
        button.disabled = true;
      });
  }

  function stop() {
    mediaRecorder.stop();
    button.classList.remove("recording");
    btn_status = "inactive";

    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

    var now = Math.ceil(new Date().getTime() / 1000);

    var t = parseTime(now - time);

    msg_box.innerHTML =
      '<a href="#" onclick="play(); return false;" class="txt_btn">' +
      lang.play +
      " (" +
      t +
      "s)</a><br>" +
      '<a href="#" onclick="save(); return false;" class="txt_btn">' +
      lang.download +
      "<br>" +
      '<a href="#" onclick="upload(); return false;" class="txt_btn">' +
      lang.upload +
      "</a>";
  }

  function play() {
    audio.play();
    msg_box.innerHTML =
      '<a href="#" onclick="pause(); return false;" class="txt_btn">' +
      lang.stop +
      "</a><br>" +
      '<a href="#" onclick="save(); return false;" class="txt_btn">' +
      lang.download +
      "<br>" +
      '<a href="#" onclick="upload(); return false;" class="txt_btn">' +
      lang.upload +
      "</a>";
  }

  function pause() {
    audio.pause();
    audio.currentTime = 0;
    msg_box.innerHTML =
      '<a href="#" onclick="play(); return false;" class="txt_btn">' +
      lang.play +
      "</a><br>" +
      '<a href="#" onclick="save(); return false;" class="txt_btn">' +
      lang.download +
      "<br>" +
      '<a href="#" onclick="upload(); return false;" class="txt_btn">' +
      lang.upload +
      "</a>";
  }

  function roundedRect(ctx, x, y, width, height, radius, fill) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width - radius, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    ctx.lineTo(x + width, y + radius);
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.quadraticCurveTo(x, y, x, y + radius);

    ctx.fillStyle = fill;
    ctx.fill();
  }

  function save() {
    var a = document.createElement("a");
    a.download = "record.ogg";
    a.href = audioSrc;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
  }
} else {
  if (location.protocol != "https:") {
    msg_box.innerHTML = lang.mic_error + "<br>" + lang.use_https;
  } else {
    msg_box.innerHTML = lang.mic_error;
  }
  button.disabled = true;
}

function upload()
{

    //add spinner
    document.getElementById('load').innerHTML = '<i class="fa-solid fa-cog fa-spin fa-2x text-center"></i>';
    document.getElementById('load').classList.add("text-center")
    document.getElementById("trans").textContent = "";
    document.getElementById("senti").textContent = "";
    document.getElementById("score").textContent = "";
    var fd = new FormData();
    fd.append('file', blob ,'recording.ogg')    
    const res = axios
    .post("https://athena-a6clm7lhrq-oa.a.run.app/audio", fd)
    .then((res) => {
        console.log("Successfully sent");
        console.log("Status Code: " + res.status);
        console.log("Body: ", res.data[0]); // MCIT API returns a JSON object which looks like this: {'transcript' : "الحمدلله"}
    //remove_icon
    document.getElementById('load').innerHTML =""
    
        var transcripts = []
        var sentiments = []
        var scores = []
        for (let i = 0; i < res.data.length; i++) {
        transcripts.push(res.data[i].Transcript);
        sentiments.push(res.data[i].Sentiment);
        scores.push(res.data[i].Score);
            console.log(i)
        }
        var k = 0;
        for (let i = 0; i < transcripts.length; i++) {
        k += 1;
        document.getElementById("trans").textContent =
            "Transcript= " +transcripts[i];
        document.getElementById("senti").textContent =
            "Sentiment= " + sentiments[i];
        document.getElementById("score").textContent =
            "Score= " + scores[i];
        // document.getElementById("count").textContent = "count= " + k;
        console.log(k);
        }
    })
    .catch((err) => {
        console.log(res);
        console.log("Error: " + err);
    });
    

}
