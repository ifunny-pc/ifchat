const { ipcRenderer } = require("electron")
const $ = require("jquery")
const sleep = require("../../lib/sleep")

$(async () => {
    //Gets logo dom and adds it to jquery
    var logo = $("#logo")

    var rotate = async function() {
        //Rotates the image every X miliseconds
        
        let angle = 0 //Count for degrees.

        while (true) {

            if (angle > 360) {
                angle = 0
            }


            logo.css({ transform: `rotate(${angle}deg)` })

            angle += 1

            await sleep(angle / 40)
        }
    }
    
    rotate()

    ipcRenderer.send("get-app-version")
    ipcRenderer.on("app-version", (event, arg) => {
        ipcRenderer.removeAllListeners("get-app-version")
        ipcRenderer.removeAllListeners("app-version")
        $("#version").text(arg.version)
    })
})