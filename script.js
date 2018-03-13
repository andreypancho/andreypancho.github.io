window.onload = () => {
  const send = document.getElementById("send");
  const input = document.getElementById("search");
  const result = document.getElementById("result");

  send.addEventListener("click", () => {
    console.log(encodeURIComponent(input.value));
    let url = `https://itunes.apple.com/search?term=${encodeURIComponent(input.value)}`;

    fetch(url, { method: "GET" })
      .then(response => {
        console.log(response.headers.get("Content-Type")); // application/json; charset=utf-8
        console.log(response.status); // 200
        // console.log(response.json());
        return response.json();
      })
      .then(data => {
        // console.log(data);
        createResultTable(data);
      })
      .catch(console.log("error"));
  });

  function createResultTable(data) {
    var html = `<table>`;
    html += `<tr>`;
    html += `<th></th>`;
    html += `<th>Artist</th>`;
    html += `<th>Track</th>`;
    html += `<th>Collection</th>`;
    html += `<th>Genre</th>`;
    html += `<th></th>`;
    html += `</tr>`;
    for (let i = 0; i < data.results.length; i++) {
      if (i % 2 == 0) {
        var background = "background:#ccdff0";
      } else {
        var background = "background:#eef7ff";
      }
      console.log(data.results[i]);
      html += `<tr class='head' style=${background}>`;
      html += `<td><img style='display: block;margin: 0 auto;' src=${data.results[i].artworkUrl100}></td>`;
      html += `<td>${check(data.results[i].artistName)}</td>`;
      html += `<td>${check(data.results[i].trackName)}</td>`;
      html += `<td>${check(data.results[i].collectionName)}</td>`;
      html += `<td>${check(data.results[i].primaryGenreName)}</td>`;
      html += `<td style='text-align:center'><i class="fa fa-plus" aria-hidden="true"></i></td>`;
      html += `</tr>`;

      html += `<tr class='hide' style=${background}>`;
      html += `<td></td>`;
      html += `<td colspan='2'>${artistAndTrack(data.results[i].trackViewUrl, data.results[i].artistName, data.results[i].trackName)}</br>
                               Collection: ${check(data.results[i].collectionName)}</br>
                               Track Count: ${check(data.results[i].trackCount)}</br>
                               Price: ${check(data.results[i].collectionPrice)} USD</td>`;
      html += `<td colspan='3'>Track duration: ${timeConverter(data.results[i].trackTimeMillis)}</br>
                               Track Price: ${check(data.results[i].trackPrice)} USD</br></td>`;
      html += `</tr>`;
    }
    html += `</table>`;
    result.innerHTML = html;

    var rows = document.querySelectorAll('.head');

    for (let i = 0; i < rows.length; i++) {
      rows[i].addEventListener('click', (e) => {
        if (e.target.tagName == 'IMG') return;
        let flag = false;
        if (e.target.parentNode.className != 'active' && !flag) {
          let allRows = document.querySelectorAll('table tr');
          for (let i = 1; i < allRows.length; i++) {
            if (i % 2 == 0) {
              allRows[i].className = 'hide';
            } else {
              allRows[i].className = 'head';
              allRows[i].lastChild.innerHTML = '<i class="fa fa-plus" aria-hidden="true"></i>';
            }
          }
          e.target.parentNode.className = 'active';
          e.target.parentNode.lastChild.innerHTML = '<i class="fa fa-minus" aria-hidden="true"></i>';
          e.target.parentNode.nextSibling.className = 'show';
          flag = true;
        } else {
          e.target.parentNode.className = 'head';
          e.target.parentNode.lastChild.innerHTML = '<i class="fa fa-plus" aria-hidden="true"></i>';
          e.target.parentNode.nextSibling.className = 'hide';
          flag = false;
        }
      })
    }
  }

  function timeConverter(msec) {
    msec = parseInt(msec);
    var min = Math.floor(msec / 60000);
    var sec = Math.round((msec / 1000) % 60);
    sec <= 9 ? (sec = `0${sec}`) : (sec = sec);
    return `${min}:${sec} min`;
  }

  function check(arg) {
    if (arg === undefined) {
      return 'none info';
    } else {
      return arg;
    }
  }

  function artistAndTrack(url, artist, track) {
    return `<a href=${url} target="_blank">${artist} - ${track} <i class="fa fa-music" aria-hidden="true"></i></a>`;
  }
};
