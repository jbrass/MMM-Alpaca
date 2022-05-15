# MMM-Alpaca -  MagicMirror Alpaca Module
This is a module to get data from Alpaca and display it on a [MagicMirror](https://github.com/MichMich/MagicMirror). 

This is based on the work of [MagicMirror-Module-Template](https://github.com/roramirez/MagicMirror-Module-Template/) and [MMM-Questrade](https://github.com/Daniel1145/MMM-Questrade/)


## Installation
1. Navigate to your MagicMirror/modules directory
2. Clone the module with: `git clone https://github.com/jbrass/MMM-Alpaca`
3. Change to the module directory (cd MMM-Alpaca/)
4. Install the Alpaca dependencies (npm install)


```shell
cd ~/MagicMirror/modules
git clone https://github.com/jbrass/MMM-Alpaca.git
cd MMM-Alpaca/
npm install
```

5. Configure the module following the instructions below


## Configuration
This module requires you to provide your own API key and secret key from Alpaca. These can be found on your Alpaca overview page: https://app.alpaca.markets/paper/dashboard/overview .

To use this module, add the following to your config.js file:
```Javscript
modules: [
  ...
  {
      module: 'MMM-Alpaca',
      position: 'top_right',
      config: {
			  keyId:'<Your account id>',
			  secretKey: '<Your secret key>',        
        paper: <True of False if this is a paper account>,
      }
   },
   ...
]
```
