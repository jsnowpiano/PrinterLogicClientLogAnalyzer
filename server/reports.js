const testlogs = require("./testlogs")

let reports = []
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
                type: "CAC",
                report: status
            })
        }

    }
}


function GenerateReports(logs) {
    for (let i = 0; i < logs.length; i++) {
        if (checkHeaderReport(logs[i])) {
            createHeaderReport(logs[i])
        }
    }
}

GenerateReports(testlogs.logs);
console.log(reports)
