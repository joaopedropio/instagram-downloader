const Fs = require('fs')  
const Path = require('path')  

class Downloader {
    constructor(axios, contentFolder, instagramService) {
        this.service = instagramService
        this.contentFolder = contentFolder
        this.axios = axios
    }

    async downloadImageFromStory(username, story) {
        const dir = Path.resolve(this.contentFolder, username, 'images', story.expiringAt)
        if (!Fs.existsSync(dir)){
            Fs.mkdirSync(dir, { recursive: true });
        }
        const path = Path.resolve(dir, `${story.id}.png`)
        const writer = Fs.createWriteStream(path)
    
        let response = await this.axios.get(story.url, {
            responseType: 'stream'
        })
      
        response.data.pipe(writer)
      
        return new Promise((resolve, reject) => {
          writer.on('finish', resolve)
          writer.on('error', reject)
        })
    }

    async downloadVideoFromStory(username, story) {
        const dir = Path.resolve(this.contentFolder, username, 'videos', story.expiringAt)
        if (!Fs.existsSync(dir)){
            Fs.mkdirSync(dir, { recursive: true });
        }
        const path = Path.resolve(dir, `${story.id}.mp4`)
        const writer = Fs.createWriteStream(path)
    
        let response = await this.axios.get(story.url, {
            responseType: 'stream'
        })
      
        response.data.pipe(writer)
      
        return new Promise((resolve, reject) => {
          writer.on('finish', resolve)
          writer.on('error', reject)
        })
    }
    
    async downloadStoriesFromUsername(username) {
        let userID = await this.service.getUserIdByUserName(username)
        if (userID === undefined) {
            return
        }
        let stories = await this.service.getUserStories(userID)
        if (stories === undefined) {
            return
        }
        if (!Fs.existsSync(this.contentFolder)){
            Fs.mkdirSync(this.contentFolder);
        }    
        stories.forEach(async story => {
            if (story.isVideo) {
                this.downloadVideoFromStory(username, story)
            }
            if (story.isImage) {
                this.downloadImageFromStory(username, story)
            }
        });

    }
}

module.exports = Downloader