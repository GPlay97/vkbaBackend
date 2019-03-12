const request = require('request');
const config = require('../config.json');
const errors = require('../errors.json');

const sendRequest = async (params, cookie, followRedirect) => {
  return new Promise((resolve, reject) => {
      request({
          uri: `${config.BANK_URL}?${params}`,
          method: 'GET',
          timeout: 10000,
          jar: cookie ? request.jar().setCookie(cookie, config.BANK_URL) : true,
          followRedirect: !!followRedirect
      }, (err, response, body) => {
          if (err) return reject(err);
          resolve({
              response,
              body
          });
      });
  });
};

const getCookie = async () => {
    return sendRequest(`token=${config.BANK_TOKEN}`)
            .then((obj) => obj.response.headers["set-cookie"][0]);
};

const getContent = async (cookie) => {
    // &accounts[]=*vkba&type=PowerSign
    return sendRequest('limit=250', cookie, true)
        .then((obj) => obj.body);
};

const parseContent = (content) => {
    return content
        .split('<tr class="hover">').filter((_, key) => key)
        .map((b) => b.split(/<\/?td[^>]*>/).filter((c) => c.trim()))
        .map((row) => ({
            timestamp: row[0],
            account: row[1]
        }));
};

const getPage = async (page) => {
    try {
        const cookie = await getCookie();

        console.log({cookie});
        getContent(cookie)
            .then((content) => console.log(parseContent(content)))
            .catch((err) => console.error(err));
    } catch (err) {
        console.error(err);
    }
};


module.exports = {
    getPage
};