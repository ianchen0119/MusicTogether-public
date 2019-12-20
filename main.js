const { plugin, value, computed, watch, onMounted } = window.vueFunctionApi;
Vue.use(plugin);

new Vue({
  setup() {
    // state data
    const accesstoken = value('uncatch');
	const apikey = value("");
	const videoId = value('uncatch');
	const youtubesrc = value("");
	const loading = value(true);
	const search = value("周杰倫");
	const searchreponse = value("");
	const page = value(0);
	const pagelimit = value("");
	const kklogin = value("");
	const rankreponse = value("");
    //methods
    const searchbar = ()=>{
			if(accesstoken.value!=='uncatch'){
			  const config = {
				headers: { 'Authorization': `Bearer ${accesstoken.value}` }
				}
			  axios
			    .get(`https://api.kkbox.com/v1.1/search?q=${search.value}&territory=TW&limit=50&type=track` , config)
			    .then(response => {
			      searchreponse.value = response.data.tracks.data;
			      pagelimit.value = response.data.tracks.data.length;
			      page.value = 1;
			    })
			    .catch(error => {
			      console.log(error);
			    })
			  }
			else{
				console.log("請登入!");
			}
			};
	const pageminus = ()=>{
				if (page.value==0) {
					alert("這已經是最上層!");
				}
				else{
					page.value--;
				}
			}
	const pageplus = ()=>{
				if (page.value==pagelimit.value) {
					alert("這已經是最下層!");
				}
				else{
					page.value+=1;
				}
			}
	const getsrc = (index)=>{
				document.querySelector('#kkbox').src = "https://widget.kkbox.com/v1/?id="+searchreponse.value[index].id+"&type=song";
			}
	const login= ()=>{
				kklogin.value = window.location.search;
				if (kklogin.value=="") {
				}
				else{
				let re = /code=/gi;
				let re2 = /state=123/gi;
				let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]") 
				let newstr = kklogin.value.replace(re, '');
				newstr = newstr.replace(re2, '');
				newstr = newstr.replace(pattern, '');
				newstr = newstr.replace(pattern, '');
				kklogin.value = newstr;
				console.log(kklogin.value);
				getToken();
				}
			}
	const getToken = ()=>{
				const config = {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
				};
				const params = new URLSearchParams();
				params.append('grant_type', 'authorization_code');
				params.append('code', `${kklogin.value}`);
				params.append('client_id', 'b09edcab8ba6c5a20e7d3622ed17761e');
				params.append('client_secret', '262d83bfb61a0ebf9cd777ad9d58262d');
			  axios
			    .post("https://cors-anywhere.herokuapp.com/https://account.kkbox.com/oauth2/token", params, config)
			    .then(response => {
			      accesstoken.value = response.data.access_token;
			      document.querySelector('#login').style.display="none";
			      searchrank();
				searchbar();
			    })
			    .catch(error => {
			      console.log(error);
			    })
			}
	const playbyyoutube = (sing)=>{
			 axios
			    .get("https://www.googleapis.com/youtube/v3/search?q="+sing+"&maxResults=1&part=snippet&key="+apikey.value )
			    .then(response => {
			      videoId.value = response.data.items[0].id.videoId;
				setVideoPlayer();
			    })
			    .catch(error => {
			      console.log(error);
			    })
			}
	const setVideoPlayer = ()=> {
        	youtubesrc.value =  `https://www.youtube.com/embed/${videoId.value}?autoplay=1&theme=light`;
      	}
    const searchrank = ()=>{
				const config = {
				headers: { 'Authorization': `Bearer ${accesstoken.value}` }
				}
			  axios
			    .get("https://api.kkbox.com/v1.1/charts/X-6lSz-IwzDxkPuDP-/tracks?territory=TW&limit=5" , config)
			    .then(response => {
			      rankreponse.value = response.data.data;
			      console.log(response.data.data)
			    })
			    .catch(error => {
			      console.log(error);
			    })
		}  	

    // lifecycle
    onMounted(() => {
      searchbar();
      login();
    });
    return {
      accesstoken,
      search,
      apikey,
      videoId,
      youtubesrc,
      loading,
      searchreponse,
      page,
      pagelimit,
      kklogin,
      rankreponse,
      searchbar,
      pageminus,
      pageplus,
      getsrc,
      login,
      getToken,
      playbyyoutube,
      setVideoPlayer,
      searchrank
       };

  } }).$mount('#app');
