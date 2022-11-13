class InstagramService {
    constructor(client) {
        this.client = client
    }

    async getUserIdByUserName(username) {
        try {
            let response = await this.client.getUserProfileInfo(username)
            return this.getUserIdFromResponse(response)
        } catch (error) {
            console.log(error)
            return undefined
        }
    }
    
    async getUserStories(userid) {
        try {
            let response = await this.client.getFeed(userid)
            return this.getStoriesFromResponse(response)
        } catch (error) {
            console.log(error)
            return undefined
        }
    }
    
    getUserIdFromResponse(response) {
        return response['data']['data']['user']['id']
    }
    
    getStoriesFromResponse(response) {
        // foto => is_unified_video: false, is_reel_media: true, image_versions2.candidates: [].url
        return response['data']['reel']['items']
            .map((item, index, arr) => this.mapMedia(item, index, arr))
            .filter(x => x != undefined)
    }

    mapMedia(item, index, arr) {
        if (this.isVideo(item)) {
            return this.parseVideo(item)
        }
        if (this.isImage(item)) {
            return this.parseImage(item)
        }
        return undefined
    }

    isImage(item) {
        return item['image_versions2'] != undefined
    }

    isVideo(item) {
        return item['video_versions'] != undefined
    }

    parseImage(item) {
        let id = item['id']
        let url = item['image_versions2']['candidates'][0]['url']
        return {
            id: id,
            url: url,
            isVideo: false,
            isImage: true,
            expiringAt: this.epochToDateString(item['expiring_at'])
        }
    }

    parseVideo(item) {
        let id = item['id']
        let url = item['video_versions'][0]['url']
        return {
            id: id,
            url: url,
            isVideo: true,
            isImage: false,
            expiringAt: this.epochToDateString(item['expiring_at'])
        }
    }

    epochToDateString(value) {
        let oneDayInEpoch = 86400 * 1000
        let expiringDateInEpoch = (value * 1000)
        let postDateInEpoch = expiringDateInEpoch - oneDayInEpoch
        let date = new Date(postDateInEpoch)
        return date.toISOString().split('T')[0]
    }
}

module.exports = InstagramService