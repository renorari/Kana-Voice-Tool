var wavesurfer = WaveSurfer.create({
    container: "#waveform"
});

document.getElementById("input").value = localStorage.getItem("text");

if (localStorage.getItem("login")) {
    document.getElementById("id").value = JSON.parse(localStorage.getItem("login")).id;
    document.getElementById("password").value = JSON.parse(localStorage.getItem("login")).password;
};

fetch("https://kana.renorari.net/api/voice_list.json", { "method": "GET" }).then((res) => res.json()).then((data) => {
    data.forEach(speaker => {
        var option = document.createElement("option");
        option.appendChild(document.createTextNode(speaker.name));
        option.value = speaker.id;
        document.getElementById("voice").appendChild(option);
    });
    if (localStorage.getItem("voice")) document.getElementById("voice").value = localStorage.getItem("voice");
});

document.getElementById("play_btn").onclick = () => {
    if (wavesurfer.isPlaying()) {
        wavesurfer.pause();
        document.getElementById("play_btn").innerHTML = "play_arrow";
        return;
    };
    document.getElementById("input").setAttribute("disabled", null);
    document.getElementById("play_btn").innerHTML = "pause";
    fetch(`https://kana.renorari.net/api/voice`, { "method": "POST", "body": `text=${encodeURI(document.getElementById("input").value.replace(/\n/g, " "))}&id=${encodeURI(document.getElementById("id").value)}&password=${encodeURI(document.getElementById("password").value)}&voice=${document.getElementById("voice").value}` }).then((res) => {
        if (res.status == 200) return res.blob();
        else return res.text();
    }).then((data) => {
        document.getElementById("input").removeAttribute("disabled");
        if (typeof data == "string") {
            document.getElementById("play_btn").innerHTML = "play_arrow";
            alert(`エラーが発生しました。\n\nエラー: ${data}`);
            return;
        };
        localStorage.setItem("login", JSON.stringify({ "id": document.getElementById("id").value, "password": document.getElementById("password").value }));
        localStorage.setItem("voice", document.getElementById("voice").value);
        wavesurfer.loadBlob(data);
        wavesurfer.on('ready', () => wavesurfer.play());
        wavesurfer.on("finish", () => document.getElementById("play_btn").innerHTML = "play_arrow");
    }).catch(error => {
        console.error(error);
        alert(`エラーが発生しました。\n\nエラー: ${error}`);
    });
};

document.getElementById("skipbackward_btn").onclick = () => wavesurfer.skipBackward();
document.getElementById("skipforward_btn").onclick = () => wavesurfer.skipForward();

document.getElementById("download_btn").onclick = () => {
    fetch(`https://kana.renorari.net/api/voice`, { "method": "POST", "body": `text=${encodeURI(document.getElementById("input").value)}&id=${encodeURI(document.getElementById("id").value)}&password=${encodeURI(document.getElementById("password").value)}&voice=${document.getElementById("voice").value}` }).then((res) => {
        if (res.status == 200) return res.blob();
        else return res.text();
    }).then((data) => {
        if (typeof data == "string") return alert(`エラーが発生しました。\n\nエラー: ${data}`);
        localStorage.setItem("login", JSON.stringify({ "id": document.getElementById("id").value, "password": document.getElementById("password").value }));
        localStorage.setItem("voice", document.getElementById("voice").value);
        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.download = document.getElementById("input").value.substr(0, 5) + ".wav";
        a.href = url;
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }).catch(error => {
        console.error(error);
        alert(`エラーが発生しました。\n\nエラー: ${error}`);
    });
};

document.onkeydown = (event) => {
    if (event.key == ("F5" || " ")) {
        document.getElementById("play_btn").onclick();
        return false;
    };
    if (event.key == ("Delete")) {
        document.getElementById("stop_btn").onclick();
        return false;
    };
    if (event.key == "F6") {
        document.getElementById("download_btn").onclick();
        return false;
    };

    localStorage.setItem("text", document.getElementById("input").value);
}