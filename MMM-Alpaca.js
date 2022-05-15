
'use strict';

Module.register("MMM-Alpaca", {
    defaults: {
        tableTitle: 'Positions',
        maxRows: 10,
        rowBorder: true,
        updateInterval: 30000,
        columns: [
            'symbol',
            'current_price',
            'qty',
            'market_value',
            'unrealized_pl',
            'unrealized_plpc',
            'change_today',
            'cost_basis',
            'no_data',
        ],
        columnAliases: {
            symbol: 'Symbol',
            qty: 'Quantity',
            market_value: 'Market Value',
            current_price: 'Current Price',

            cost_basis: 'Cost Basis',
            change_today: 'Change Today',
            unrealized_pl: 'Open P&L',
            unrealized_plpc: 'P&L %',
            no_data: 'No Data'
        }
    },

    getStyles: function () {
        return ['MMM-Alpaca.css'];
    },

    start: function () {
        const self = this;
        Log.info('Now Starting module: ' + self.name);

        self.tableData = {};

        self.fetchTableData();
        setInterval(() => {
            self.fetchTableData();
        }, self.config.updateInterval);
    },

    getDom: function () {
        const self = this;
        const wrapper = document.createElement('div');
        var header = document.createElement("header");
        header.innerHTML = this.config.tableTitle;
        wrapper.appendChild(header);
        const tableData = this.tableData;

        if (Object.keys(tableData).length === 0) {
            wrapper.className = 'small dimmed';
            wrapper.innerHTML = `Loading...`;
        } else {
            wrapper.setAttribute('id', 'questrade');
            wrapper.appendChild(self.buildTableDom(tableData, self.config));
        }

        return wrapper;
    },

    buildTableDom: function (tableData) {
        const decimalColumns = [
            'unrealized_pl',
            'unrealized_plpc',
            'change_today', 
            'market_value', 
            'current_price', 
            // 'averageEntryPrice', 
            // 'closedPnl', 
            // 'totalCost'
        ].reduce((acc, colToFind) => {
            acc[colToFind] = tableData.columns.findIndex(currColumn => currColumn === colToFind);
            return acc;
        }, {});
        const self = this;
        const percent_columns = ['change_today','unrealized_plpc'].reduce((acc, colToFind) => {
            acc[colToFind] = tableData.columns.findIndex(currColumn => currColumn === colToFind);
            return acc;
        }, {});
        var tableWrapper = document.createElement('table');
        tableWrapper.className = 'qt-table';

        var columnsWrapper = document.createElement('tr');
        var tmp = tableData.columns[decimalColumns['unrealized_pl']];
        tableData.columns[decimalColumns['unrealized_pl']] = tableData.columns[tableData.columns.length - 1];
        tableData.columns[tableData.columns.length - 1] = tmp;
        tableData.columns.map(column => {
            var columnElement = document.createElement('th');
            columnElement.className = 'bright' + (self.config.rowBorder ? ' show-border' : '');
            columnElement.appendChild(document.createTextNode(Object.keys(self.config.columnAliases).includes(column) ? self.config.columnAliases[column] : column));
            columnsWrapper.appendChild(columnElement);
        });

        tableWrapper.appendChild(columnsWrapper);

        tableData.rows.map((row, rowNum) => {
            if (rowNum < self.config.maxRows) {
                var rowWrapper = document.createElement('tr');
                var tmp = row[decimalColumns['unrealized_pl']];
                row[decimalColumns['unrealized_pl']] = row[row.length - 1];
                row[row.length - 1] = tmp;
                // console.log(decimalColumns)
                // console.log(percent_columns)
                row.map((cell, col) => {
                    
                    if (Object.values(decimalColumns).includes(col)) {

                        if (!Object.values(percent_columns).includes(col)) {
                            // console.log(cell)
                            cell = Number.parseFloat(cell)
                            // console.log(cell)
                            // cell = cell * 100
                            // console.log(cell)
                            cell = cell.toFixed(2)
                            // console.log(cell)
                        }else{
                            cell = Number.parseFloat(cell)
                            cell = cell.toFixed(2)
                            // console.log(cell)
                        }

                        // cell = Number.parseFloat(cell).toFixed(2);
                    }
                    // if (Object.values(percent_columns).includes(col)) {
                    //     console.log(col)
                    //     cell = Number.parseFloat(cell) * 100
                    //     cell = cell.toFixed(2);
                    // }
                    var cellElement = document.createElement('td');
                    var pnl = ((col === decimalColumns.unrealized_pl || col === decimalColumns.change_today) ? (cell >= 0 ? 'profit' : 'loss') : '');
                    cellElement.className = (self.config.rowBorder ? 'show-border ' : '') + pnl;
                    cellElement.appendChild(document.createTextNode(cell));
                    rowWrapper.appendChild(cellElement);
                });
                tableWrapper.appendChild(rowWrapper);
            }
        });

        return tableWrapper;
    },

    fetchTableData: function () {
        var self = this;

        var account_type = this.config.paper ? "PAPER":"LIVE";
        // console.log(account_type)
      
        //this.sendSocketNotification('FETCH_POSITIONS', this.config);

        this.sendSocketNotification( 'FETCH_POSITIONS_'+ account_type, this.config);
    },

    socketNotificationReceived: function (notification, payload) {
        var account_type = this.config.paper ? "PAPER":"LIVE";
        var self = this;

        if (notification === 'POSITIONS_RECEIVED_'+ account_type) {
            // console.log('POSITIONS_RECEIVED_'+ account_type)
            const { tableConfig, tableData } = payload;
            // console.log(tableConfig)
            // console.log(tableData)
            self.tableData = tableData;
            self.updateDom();
        }
    },
});