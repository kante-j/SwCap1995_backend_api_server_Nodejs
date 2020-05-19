const {Expo} = require('expo-server-sdk')
var express = require('express');

class PushService {

    expo = new Expo();
    // savedPushTokens = [];

    // saveToken = (token) => {
    //     if (this.savedPushTokens.indexOf(token === -1)) {
    //         this.savedPushTokens.push(token);
    //     }
    // };

    handlePushTokens = (message, token) => {
        let notifications = [];
        // for (let pushToken of token) {
        if (!Expo.isExpoPushToken(token)) {
            console.error(`Push token ${token} is not a valid Expo push token`);
            // continue;
        }
        notifications.push({
            to: token,
            sound: 'default',
            title: 'Message received!',
            body: message,
            data: {message}
        });

        let chunks = this.expo.chunkPushNotifications(notifications);
        (async () => {
            for (let chunk of chunks) {
                try {
                    let receipts = await this.expo.sendPushNotificationsAsync(chunk);
                    console.log(receipts);
                } catch (error) {
                    console.error(error);
                }
            }
        })();
    };
}

module.exports = new PushService();
