var app = new Vue({
		el:'#app',
		data(){
			return{
				accesstoken:null,
				apikey:"",
				videoId:null,
				youtubesrc:null,
				loading:true,
				search:null,
				searchreponse:null,
				page:0,
				pagelimit:null,
				kklogin:null
			};
		},
		created(){
				this.searchbar();
				this.login();
		},
		methods:{
			searchbar() {
			if(this.accesstoken!=null){
			  const config = {
				headers: { 'Authorization': `Bearer ${this.accesstoken}` }
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
			  }
			else{
				console.log("請登入!");
			}
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
			login(){
				this.kklogin=window.location.search;
				if (this.kklogin=="") {
				}
				else{
				let re = /code=/gi;
				let re2 = /state=123/gi;
				let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]") 
				let newstr = this.kklogin.replace(re, '');
				newstr = newstr.replace(re2, '');
				newstr = newstr.replace(pattern, '');
				newstr = newstr.replace(pattern, '');
				this.kklogin = newstr;
				console.log(this.kklogin);
				this.getToken();
				}
			},
			getToken(){
				const config = {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
				};
				const params = new URLSearchParams();
				params.append('grant_type', 'authorization_code');
				params.append('code', `${this.kklogin}`);
				params.append('client_id', 'b09edcab8ba6c5a20e7d3622ed17761e');
				params.append('client_secret', '262d83bfb61a0ebf9cd777ad9d58262d');
			  axios
			    .post("https://cors-anywhere.herokuapp.com/https://account.kkbox.com/oauth2/token", params, config)
			    .then(response => {
			      this.accesstoken = response.data.access_token;
			      document.querySelector('#login').style.display="none";
				this.searchbar();
			    })
			    .catch(error => {
			      console.log(error);
			    })
			},
			playbyyoutube(sing){
			 axios
			    .get("https://www.googleapis.com/youtube/v3/search?q="+sing+"&maxResults=1&part=snippet&key="+this.apikey )
			    .then(response => {
			      this.videoId = response.data.items[0].id.videoId;
				// winRef.location = "https://www.youtube.com/watch?v="+this.videoId;
				this.setVideoPlayer();
			    })
			    .catch(error => {
			      console.log(error);
			    })
			},
			setVideoPlayer() {
        	this.youtubesrc =  `https://www.youtube.com/embed/${this.videoId}?autoplay=1&theme=light`;
      	}
		}
	})