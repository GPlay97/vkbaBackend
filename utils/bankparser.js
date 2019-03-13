const request = require('request');
const config = require('../config.json');
const logger = require('../utils/logger');
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
          if (err) {
              logger.error('Bank parsing request', err);
              return reject(errors.BANK_PARSING);
          }
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
    return sendRequest('limit=250&accounts[]=*vkba&type=PowerSign', cookie, true)
        .then((obj) => parseContent(obj.body));
};

const parseContent = (content) => {
    return content
        .split('<tr class="hover">').filter((_, key) => key)
        .map((b) => b.split(/<\/?td[^>]*>/).filter((c) => c.trim()))
        .map((row) => ({
            timestamp: parseInt(new Date(row[0]) / 1000) || 0,
            sender: row[1],
            amount: parseFloat(row[3]) || 0,
            receiver: row[4],
            usage: 'Einzahlung via VKBA-Geldautomat'
        }));
};

const getPage = async (page) => {
    // TODO page
    return getContent(await getCookie());
};


module.exports = {
    getPage
};