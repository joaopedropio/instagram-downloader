const Path = require('path')  
const axios = require('axios');
const InstagramClient = require('./instagramClient')
const InstagramService = require('./instagramService')
const Downloader = require('./downloader')

//const storyID = '2970477597725844841'

//const id = "8268123110"

const contentFolder = Path.resolve(__dirname, 'content')
const env = require('./environment')

// const defaultHeaders = {
//     'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
//     'sec-ch-ua-mobile': '?0',
//     'sec-fetch-dest': 'empty',
//     'sec-fetch-mode': 'cors',
//     'sec-fetch-site': 'same-site',
//     'x-ig-app-id': '936619743392459',
//     'x-ig-www-claim': 'hmac.AR0A6WzcCoXWstKAUuy1gRbCQFUs8FoZCp3ap2UMk_KQNBSH'
//   }

// async function downloadVideoFromURL(url) {
//     const response = await fetch(url);
//     const buffer = await response.buffer();
//     await writeFile('test.mp4', buffer);
//     console.log('Done!');
// }



let instagramClient = new InstagramClient(axios, env.sessionId, env.ds_user_id)
let instagramService = new InstagramService(instagramClient)
let downloader = new Downloader(axios, contentFolder, instagramService)

downloader.downloadStoriesFromUsername('cauemoura');