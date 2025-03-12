const testlogs = require("./testlogs")

let reports = [];
let printersChanged = 0;
function checkHeaderReport(log) {
    if (log.id <= 26) {
        return true
    }
}

function checkHeaderSection(log) {
    if (log.id >= 0 && log.id <=3 ) {
        return 0
    } else if (log.id >= 5 && log.id <= 23) {
        return 1
    } else if (log.id >= 24 && log.id <= 27) {
        return 2
    } else {
        return false
    }
}

function createHeaderReport(log) {
    if( checkHeaderSection(log) == 0) {
        if (log.description.includes("Printer Installer Client")) {
            let start = log.description.indexOf("V") + 1
            let version = log.description.substr( start , log.description.length - 1)
            reports.push( {
                id: reports.length,
                type: "clientversion",
                report: version
            })
        } else if (log.description.includes("Operating System")) {
            let start = log.description.indexOf(":") + 2
            let OS = log.description.substr( start , log.description.length - 1)
            reports.push( {
                id: reports.length,
                type: "os",
                report: OS
            })
        }
    }
    if (checkHeaderSection(log) == 1) {
        if (log.description.includes("Pull Printing")) {
            let start = log.description.indexOf("g") + 2
            let status = log.description.substr( start , log.description.length - 1)
            reports.push( {
                id: reports.length,
                type: "pullprinting",
                report: status
            })
        } else if (log.description.includes("Mobile Printing")) {
            let start = log.description.indexOf("g") + 2
            let status = log.description.substr( start , log.description.length - 1)
            reports.push( {
                id: reports.length,
                type: "mobileprinting",
                report: status
            })
        } else if (log.description.includes("PIV/CAC")) {
            let start = log.description.indexOf(":") + 2
            let status = log.description.substr( start , log.description.length - 1)
            reports.push( {
                id: reports.length,
                type: "CAC",
                report: status
            })
        } else if (log.description.includes("IDP")) {
            let start = log.description.indexOf(":") + 2
            let status = log.description.substr( start , log.description.length - 1)
            reports.push( {
                id: reports.length,
                type: "IDP",
                report: status
            })
        } else if (log.description.includes("Off Network Printing Enabled")) {
            let start = log.description.indexOf(":") + 2
            let status = log.description.substr( start , log.description.length - 1)
            reports.push( {
                id: reports.length,
                type: "ONP",
                report: status
            })
        } else if (log.description.includes("Off Network Printing Default")) {
            let start = log.description.indexOf(":") + 2
            let status = log.description.substr( start , log.description.length - 1)
            reports.push( {
                id: reports.length,
                type: "ONPD",
                report: status
            })
        } else if (log.description.includes("Off Network Cloud Printing Enabled")) {
            let start = log.description.indexOf(":") + 2
            let status = log.description.substr( start , log.description.length - 1)
            reports.push( {
                id: reports.length,
                type: "ONCP",
                report: status
            })
        } else if (log.description.includes("Off Network Cloud Printing Default")) {
            let start = log.description.indexOf(":") + 2
            let status = log.description.substr( start , log.description.length - 1)
            reports.push( {
                id: reports.length,
                type: "ONCPD",
                report: status
            })
        } else if (log.description.includes("Home Path")) {
            let start = log.description.indexOf(":") + 2
            let status = log.description.substr( start , log.description.length - 1)
            reports.push( {
                id: reports.length,
                type: "HomeURL",
                report: status
            })
        } else if (log.description.includes("Home Path")) {
            let start = log.description.indexOf(":") + 2
            let status = log.description.substr( start , log.description.length - 1)
            reports.push( {
                id: reports.length,
                type: "HomeURL",
                report: status
            })
        } 
    }
}
function exists(log) {
    for (let i = 0; i < reports.length; i++) {
        if (reports[i].report == log.description) {
            return true;
        }
    }
    return false;
}


function mainConditionals(log) {
    if (log.description.includes("Printer Change Detected") ) {
        console.log("Printer change detected")
        printersChanged++;
    } else if (log.description.includes("error") || log.description.includes("ERROR") || log.description.includes("Error")) {
        console.log("Error found")
        reports.push({
            id: reports.length,
            type: "error",
            report: log.description
        })
    } else if (!exists(log)) {
        console.log("Report found")
        reports.push ({
            id: reports.length,
            type: "report",
            report: log.description
        })
    }
}

function checkIfTraceback(log) {
    if (log.description.includes("Traceback")) {
        return true;

    }else {
        return false;
    }
}


function generateReports(logs) {
    for (let i = 0; i < logs.length; i++) {
        if (checkHeaderReport(logs[i])) {
            createHeaderReport(logs[i])
        } else if(!checkIfTraceback(logs[i]) && !checkHeaderReport(logs[i]) && !exists(logs[i]) ) {
            mainConditionals(logs[i])
        }
    }
    return reports;
}

module.exports = {
    generateReports
}