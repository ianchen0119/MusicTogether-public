## MusicTogether-public 跟著六角學院和KKBOX一起聽音樂

- - -

### 應用技術

- Vue.js(without vue cli)
- axios
- PWA
- KKBOX OPENAPI
- Youtube search api

### 為何做這個專案

- - -

看到六角學院副校長分享該活動覺得很有意思,最近剛好也在學習Vue.js這項技術,因此當天看了KKBOX OPENAPI的相關影片把東西生了出來。

### 該專案的功能

- - -

該專案利用了KKBOX OPENAPI搜尋了所有KKBOX收錄的歌曲,提供KKBOX線上試聽的功能,若使用者還沒有KKBOX的付費會員又想聆聽完整歌曲,該專案也會提供歌曲的Youtube連結(利用Youtube search api實現)。
並且該專案使用PWA使該WEB APP能夠安裝在多個平台當中,提供接近原生的APP體驗。

### 注意事項

- - -

將該專案下載或是CLONE後,有幾個地方需要設定:

1. main.js中KKBOX OPENAPI以及Youtube search api的APIKEY

2. manifest.json 中的網頁起始路徑

針對上述兩點,提供以下連結方便使用者建置以及參考:

[KKBOX Open API 的相遇 By 六角學院](https://www.youtube.com/watch?v=8ipg4JxkY1s&t=12s)
[KKBOX OPENAPI投影片](https://drive.google.com/file/d/1-v7Sx3VDkn4PcLQq-H-1nR98ApMT8u_u/view)
[KKBOX DEV](https://docs-en.kkbox.codes/reference?showHidden=17dc1#devices-flow)
[YouTube Data API](https://developers.google.com/youtube/v3/docs/search/list)
[PWA 說明文件](https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/?hl=zh-tw)


### 聯絡我

- - -

[我的IT邦主頁](https://ithelp.ithome.com.tw/users/20110850)

### 聲明

- - -

該專案內的圖片、內容等皆為個人練習使用，不做任何商業用途。

