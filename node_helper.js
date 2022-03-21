const NodeHelper = require('node_helper');
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const util = require("util");

module.exports = NodeHelper.create({
        
    start: function(){
        console.log(this.name + ' helper started ...');
    },

    socketNotificationReceived : function(notification, payload){
        var self = this;
		if (notification === 'FETCH_POSITIONS') {
            const config = payload;
            const url= config.apiServer + "v1/accounts/" + config.accountId + "/positions";

            fetch(url,{
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + config.authToken
                }
            })
            .then(resp => resp.json())
            .then(data => {
                if(data.hasOwnProperty('positions')) {
                    const positions = data.positions;
                    const tableData = {
                        columns: Object.keys(positions[0]).filter(column => config.columns.includes(column)),
                        rows: positions.map(position => {
                            return Object.keys(position)
                            .filter(column => config.columns.includes(column))
                            .reduce((row, column) => {
                                row.push(position[column]);
                                return row;
                            }, [])
                        })
                    };
                    self.sendSocketNotification('POSITIONS_RECEIVED', {
                        config,
                        tableData,
                    });
                } else if(data.hasOwnProperty('code') && data.code === 1017) {
                    console.log("Access token expired");
                    self.sendSocketNotification('ACCESS_TOKEN_EXPIRED', {});
                } else {
                    console.log("Unexpected Error: " + data);
                }
            });
        }
    },      
});
