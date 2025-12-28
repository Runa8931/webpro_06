"use strict";
const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));//これを追加した

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/omikuji1", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.send( '今日の運勢は' + luck + 'です' );
});

app.get("/omikuji2", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.render( 'omikuji2', {result:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  let judgement = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  // 以下の数行は人間の勝ちの場合の処理なので，
  // 判定に沿ってあいこと負けの処理を追加する
  judgement = '勝ち';
  win += 1;
  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

let station = [
  { id:1, code:"JE01", name:"東京駅"},
  { id:2, code:"JE07", name:"舞浜駅"},
  { id:3, code:"JE12", name:"新習志野駅"},
  { id:4, code:"JE13", name:"幕張豊砂駅"},
  { id:5, code:"JE14", name:"海浜幕張駅"},
  { id:6, code:"JE05", name:"新浦安駅"},
];

app.get("/keiyo", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('db2', { data: station });
});

app.get("/keiyo_add", (req, res) => {
  let id = req.query.id;
  let code = req.query.code;
  let name = req.query.name;
  let newdata = { id: id, code: code, name: name };
  station.push( newdata );
  res.redirect('/public/keiyo_add.html');
});

let station2 = [
  { id:1, code:"JE01", name:"東京駅", change:"総武本線，中央線，etc", passengers:403831, distance:"0km" },
  { id:2, code:"JE02", name:"八丁堀駅", change:"日比谷線", passengers:31071, distance:"1.2km" },
  { id:3, code:"JE05", name:"新木場駅", change:"有楽町線，りんかい線", passengers:67206, distance:"7.4km" },
  { id:4, code:"JE07", name:"舞浜駅", change:"舞浜リゾートライン", passengers:76156,distance:"12.7km" },
  { id:5, code:"JE12", name:"新習志野駅", change:"", passengers:11655, distance:"28.3km" },
  { id:6, code:"JE17", name:"千葉みなと駅", change:"千葉都市モノレール", passengers:16602, distance:"39.0km" },
  { id:7, code:"JE18", name:"蘇我駅", change:"内房線，外房線", passengers:31328, distance:"43.0km" },
];

// 一覧
app.get("/keiyo2", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('keiyo2', {data: station2} );
});

// Create
app.get("/keiyo2/create", (req, res) => {
  res.redirect('/public/keiyo2_new.html');
});

// Read
app.get("/keiyo2/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = station2[ number ];
  res.render('keiyo2_detail', {id: number, data: detail} );
});

// Delete
app.get("/keiyo2/delete/:number", (req, res) => {
  // 本来は削除の確認ページを表示する
  // 本来は削除する番号が存在するか厳重にチェックする
  // 本来ならここにDBとのやり取りが入る
  station2.splice( req.params.number, 1 );
  res.redirect('/keiyo2' );
});

// Create
app.post("/keiyo2", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const id = station2.length + 1;
  const code = req.body.code;
  const name = req.body.name;
  const change = req.body.change;
  const passengers = req.body.passengers;
  const distance = req.body.distance;
  station2.push( { id: id, code: code, name: name, change: change, passengers: passengers, distance: distance } );
  console.log( station2 );
  res.render('keiyo2', {data: station2} );
});

// Edit
app.get("/keiyo2/edit/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = station2[ number ];
  res.render('keiyo2_edit', {id: number, data: detail} );
});

// Update
app.post("/keiyo2/update/:number", (req, res) => {
  // 本来は変更する番号が存在するか，各項目が正しいか厳重にチェックする
  // 本来ならここにDBとのやり取りが入る
  station2[req.params.number].code = req.body.code;
  station2[req.params.number].name = req.body.name;
  station2[req.params.number].change = req.body.change;
  station2[req.params.number].passengers = req.body.passengers;
  station2[req.params.number].distance = req.body.distance;
  console.log( station2 );
  res.redirect('/keiyo2' );
});




//自作
//うどん
let shouhin = [
  { id:1, name:"かけうどん", temp:"温かい", s:"茹でたうどんに温かい出汁をかけた，シンプルなうどんで風味を楽しむもの．薬味はネギや天かすなどが一般的．" },
  { id:2, name:"ざるうどん", temp:"冷たい", s:"茹でたうどんを冷水で締め，ザルなどに盛り付けたうどんで最初はつゆのみで食べると良い．薬味はネギや生姜，唐辛子などがある．" },
  { id:3, name:"ぶっかけうどん", temp:"温かい/冷たい", s:"温かいのと冷たいのが存在するうどん．コシが強く濃いつゆで食べるのでしっかり絡むのが特徴．薬味はネギ，天かす，天ぷらなどがある．" },
  { id:4, name:"釜揚げうどん", temp:"温かい", s:"茹でたうどんを水でしめず茹で汁ごと桶に入れ，温かい出しにつけて食べるうどん．もちもちした食感とツルッとした喉越しが特徴．"  },
  { id:5, name:"カレーうどん", temp:"温かい", s:"鰹節などの和風出汁に，カレールーを溶かし，片栗粉などでとろみをつけた汁が入ったうどん．カレーのように玉ねぎや豚肉などの具材が入っており，とろみのある汁で冷めにくいのが特徴．" },
];
//top
app.get("/", (req, res) => {
  res.render("top");
});
//一覧
app.get("/udon", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('udon', {data: shouhin} );
});

// Create
app.get("/udon/create", (req, res) => {
  res.redirect('/public/udon_new.html');
});

// Read
app.get("/udon/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = shouhin[ number ];
  res.render('udon_detail', {id: number, data: detail} );
});

// Delete確認画面を表示
app.get("/udon/delete/:number", (req, res) => {
  const number = req.params.number;
  const detail = shouhin[number];

  res.render("udon_delete", { id: number, data: detail });
});

// Delete 実行
app.post("/udon/delete/:number", (req, res) => {
  shouhin[req.params.number] = null;
  res.redirect("/udon");
});



// Create
app.post("/udon", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const id = shouhin.length + 1;
  const name = req.body.name;
  const temp = req.body.temp;
  const s = req.body.s
  shouhin.push( { id: id, name: name, temp: temp, s: s } );
  console.log( shouhin );
  res.render('udon', {data: shouhin} );
});

// Edit
app.get("/udon/edit/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = shouhin[ number ];
  res.render('udon_edit', {id: number, data: detail} );
});

// Update
app.post("/udon/update/:number", (req, res) => {
  // 本来は変更する番号が存在するか，各項目が正しいか厳重にチェックする
  // 本来ならここにDBとのやり取りが入る
  shouhin[req.params.number].name = req.body.name;
  shouhin[req.params.number].temp = req.body.temp;
  shouhin[req.params.number].s = req.body.s;
  console.log( shouhin );
  res.redirect('/udon' );
});

//ラーメン
let shouhin2 = [
  { id:1, name:"醤油ラーメン", temp:"東京（浅草）", s:"鶏ガラや魚介などからとった出汁に醤油だれ（かえし）を合わせたラーメン．" },
  { id:2, name:"味噌ラーメン", temp:"北海道（札幌）", s:"味噌をベースとした濃厚で濃いスープにもやしやコーン，バターなどの具材がのっているラーメン．" },
  { id:3, name:"塩ラーメン", temp:"北海道（函館）", s:"鶏ガラや野菜などの出汁がベースとなり，あっさりでヘルシーなラーメン．" },
  { id:4, name:"豚骨ラーメン", temp:"福岡（久留米）", s:"豚骨を長時間強火で煮込むことで濃厚なスープと紅生姜やキクラゲなどをトッピングするのが特徴なラーメン．"  },
  { id:5, name:"鶏白湯ラーメン", temp:"明確ではないが京都が有力", s:"取りがランドを長時間煮込むことで白濁したスープで豚骨のような重さがなく，まろやかなラーメン．" },
];
//top
app.get("/", (req, res) => {
  res.render("top");
});
//一覧
app.get("/ramen", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('ramen', {data: shouhin2} );
});

// Create
app.get("/ramen/create", (req, res) => {
  res.redirect('/public/ramen_new.html');
});

// Read
app.get("/ramen/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = shouhin2[ number ];
  res.render('ramen_detail', {id: number, data: detail} );
});

// Delete確認画面を表示
app.get("/ramen/delete/:number", (req, res) => {
  const number = req.params.number;
  const detail = shouhin2[number];

  res.render("ramen_delete", { id: number, data: detail });
});

// Delete 実行
app.post("/ramen/delete/:number", (req, res) => {
  shouhin2[req.params.number] = null;
  res.redirect("/ramen");
});



// Create
app.post("/ramen", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const id = shouhin2.length + 1;
  const name = req.body.name;
  const temp = req.body.temp;
  const s = req.body.s
  shouhin2.push( { id: id, name: name, temp: temp, s: s } );
  console.log( shouhin2 );
  res.render('ramen', {data: shouhin2} );
});

// Edit
app.get("/ramen/edit/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = shouhin2[ number ];
  res.render('ramen_edit', {id: number, data: detail} );
});

// Update
app.post("/ramen/update/:number", (req, res) => {
  // 本来は変更する番号が存在するか，各項目が正しいか厳重にチェックする
  // 本来ならここにDBとのやり取りが入る
  shouhin2[req.params.number].name = req.body.name;
  shouhin2[req.params.number].temp = req.body.temp;
  shouhin2[req.params.number].s = req.body.s;
  console.log( shouhin2 );
  res.redirect('/ramen' );
});

//パスタ
let shouhin3 = [
  { id:1, name:"スパゲッティ", temp:"円状", s:"万能パスタで，ミートソースやトマトソースと和えるとよい．" },
  { id:2, name:"フィットチーネ", temp:"長方形", s:"平な面で，ミートソースやクリームソースなど濃厚なソースとあう．" },
  { id:3, name:"マカロニ", temp:"円筒形", s:"ショートパスタで，ミートソースと和えたり，チーズをかけてオーブンで焼くとよい．" },
  { id:4, name:"ペンネ", temp:"円筒形", s:"トマトと唐辛子のオイルソースやトマトソースと和えるとよい．"  },
  { id:5, name:"ラザニア", temp:"板状", s:"幅が広く板状のため，間にひき肉やソースを挟んで調理するとよい．" },
];
//top
app.get("/", (req, res) => {
  res.render("top");
});
//一覧
app.get("/pasuta", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('pasuta', {data: shouhin3} );
});

// Create
app.get("/pasuta/create", (req, res) => {
  res.redirect('/public/pasuta_new.html');
});

// Read
app.get("/pasuta/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = shouhin3[ number ];
  res.render('pasuta_detail', {id: number, data: detail} );
});

// Delete確認画面を表示
app.get("/pasuta/delete/:number", (req, res) => {
  const number = req.params.number;
  const detail = shouhin3[number];

  res.render("pasuta_delete", { id: number, data: detail });
});

// Delete 実行
app.post("/pasuta/delete/:number", (req, res) => {
  shouhin3[req.params.number] = null;
  res.redirect("/pasuta");
});



// Create
app.post("/pasuta", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const id = shouhin3.length + 1;
  const name = req.body.name;
  const temp = req.body.temp;
  const s = req.body.s
  shouhin3.push( { id: id, name: name, temp: temp, s: s } );
  console.log( shouhin3 );
  res.render('pasuta', {data: shouhin3} );
});

// Edit
app.get("/pasuta/edit/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = shouhin3[ number ];
  res.render('pasuta_edit', {id: number, data: detail} );
});

// Update
app.post("/pasuta/update/:number", (req, res) => {
  // 本来は変更する番号が存在するか，各項目が正しいか厳重にチェックする
  // 本来ならここにDBとのやり取りが入る
  shouhin3[req.params.number].name = req.body.name;
  shouhin3[req.params.number].temp = req.body.temp;
  shouhin3[req.params.number].s = req.body.s;
  console.log( shouhin3 );
  res.redirect('/pasuta' );
});
app.listen(8080, () => console.log("Example app listening on port 8080!"));
