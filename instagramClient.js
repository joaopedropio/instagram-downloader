class InstagramClient {
    constructor(axios, sessionid, userid) {
        this.url = "https://i.instagram.com/api/v1"
        this.sessionid = sessionid
        this.userid = userid
        this.axios = axios
    }

    getConfig() {
        return {
            'headers': this.getHeaders()
        }
    }

    getHeaders() {
        return {
            'Cookie': `sessionid=${this.sessionid}; ds_user_id=${this.userid}`,
            'User-Agent': 'Instagram 76.0.0.15.395 Android (24/7.0; 640dpi; 1440x2560; samsung; SM-G930F; herolte; samsungexynos8890; en_US; 138226743)'
        }
    }

    async getUserProfileInfo(username) {
        let url = this.url + `/users/web_profile_info/?username=${username}`
        return this.axios.get(url, this.getConfig())
    }

    async getFeed(userId) {
        let url = this.url + `/feed/user/${userId}/story/`
        return this.axios.get(url, this.getConfig())
    }
}

module.exports = InstagramClient