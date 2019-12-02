var app = new Vue({
		el:'#app',
		data(){
			return{
				apikey:"",//請在此輸入Youtube search api 的密鑰
				videoId:null,
				loading:true,
				search:null,
				searchreponse:null,
				page:0,
				pagelimit:null
			};
		},
		created(){
				this.searchbar();
		},
		methods:{
			searchbar() {
			const config = {
				headers: { 'Authorization': '' }//請在此輸入KKBOX OPEN API的Authorization
				}
			  axios
			    .get("https://api.kkbox.com/v1.1/search?q="+this.search+"&territory=TW&limit=50&type=track" , config)
			    .then(response => {
			      this.searchreponse = response.data.tracks.data;
			      this.pagelimit = response.data.tracks.data.length;
			      this.page = 1;
			    })
			    .catch(error => {
			      console.log(error);
			    })
			},
			pageminus(){
				if (this.page==0) {
					alert("這已經是最上層!");
				}
				else{
					this.page--;
				}
			},
			pageplus(){
				if (this.page==this.pagelimit) {
					alert("這已經是最下層!");
				}
				else{
					this.page+=1;
				}
			},
			getsrc(index){
				document.querySelector('#kkbox').src = "https://widget.kkbox.com/v1/?id="+this.searchreponse[index].id+"&type=song";
			},
			async playbyyoutube(sing){
			  await axios
			    .get("https://www.googleapis.com/youtube/v3/search?q="+sing+"&maxResults=1&part=snippet&key="+this.apikey )
			    .then(response => {
			      this.videoId = response.data.items[0].id.videoId;
			    })
			    .catch(error => {
			      console.log(error);
			    })
			window.open("https://www.youtube.com/watch?v="+this.videoId,"_blank");
			}
		}
	})
