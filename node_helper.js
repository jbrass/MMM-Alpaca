const NodeHelper = require('node_helper');

const Alpaca = require('@alpacahq/alpaca-trade-api')
module.exports = NodeHelper.create({

    start: function () {
        console.log(this.name + ' helper started ...');
    },

    socketNotificationReceived: function (notification, payload) {
        var self = this;
        var account_type = payload.paper ? "PAPER":"LIVE";

        if (notification === 'FETCH_POSITIONS_'+ account_type) {
            const config = payload;
            // const url= config.apiServer + "v1/accounts/" + config.accountId + "/positions";
            const alpaca = new Alpaca({
                keyId: config.keyId,
                secretKey:config.secretKey ,
                paper: config.paper,
            })
            alpaca.getPositions().then((positions) => {
                // console.log('Current positions:', positions)
                if (positions.length==0){
                    var tableData = {
                        columns: ["no_data"],
                        rows:[] 
                    
                    };
                }else{
                    var tableData = {
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

                }   
                self.sendSocketNotification('POSITIONS_RECEIVED_'+ account_type, {
                    config,
                    tableData,
                });
            })
        }
    },
});
