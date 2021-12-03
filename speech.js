var voice = new Audio();

document.getElementById("play_btn").onclick = async () => {
    fetch(`https://kana.renorari.net/api/voice`, { "method": "POST", "body": `text=${encodeURI(document.getElementById("input").value)}&id=${encodeURI(document.getElementById("id").value)}&password=${encodeURI(document.getElementById("password").value)}` }).then((res) => {
        if (res.status == 200) return [res.url];
        else return res.text();
    }).then((data) => {
        if (typeof data == "string") return alert(`エラーが発生しました。\n\nエラー: ${data}`);
        voice = new Audio(data[0]);
        voice.play();
    }).catch(error => {
        console.error(error);
        alert(`エラーが発生しました。\n\nエラー: ${error}`);
    });
};

document.getElementById("stop_btn").onclick = () => voice.pause();

document.getElementById("download_btn").onclick = () => {
    fetch(`https://kana.renorari.net/api/voice`, { "method": "POST", "body": `text=${encodeURI(document.getElementById("input").value)}&id=${encodeURI(document.getElementById("id").value)}&password=${encodeURI(document.getElementById("password").value)}` }).then((res) => {
        if (res.status == 200) return res.blob();
        else return res.text();
    }).then((data) => {
        if (typeof data == "string") return alert(`エラーが発生しました。\n\nエラー: ${data}`);
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