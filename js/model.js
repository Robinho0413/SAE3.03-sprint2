import ical from 'ical';
import { EventManager } from './class/event-manager';

let Events = {
    mmi1: null,
    mmi2: null,
    mmi3: null
}

let M = {};

M.init = async function() {
    let data = await fetch('./data/mmi1.ics');
    data = await data.text();
    data = ical.parseICS(data);
    Events.mmi1 = new EventManager('mmi1', 'MMI 1', 'Agenda des MMI 1');
    Events.mmi1.addEvents(data);
    let data2 = await fetch('./data/mmi2.ics');
    data2 = await data2.text();
    data2 = ical.parseICS(data2);
    Events.mmi2 = new EventManager('mmi2', 'MMI 2', 'Agenda des MMI 2');
    Events.mmi2.addEvents(data2);

    let data3 = await fetch('./data/mmi3.ics');
    data3 = await data3.text();
    data3 = ical.parseICS(data3);
    Events.mmi3 = new EventManager('mmi3', 'MMI 3', 'Agenda des MMI 3');
    Events.mmi3.addEvents(data3);
}

M.getEvents = function(annee) {
    if ( annee in Events ) {
        return Events[annee].toObject();
    }
    return null;
}

M.getConcatEvents = function () {
    let allEv = []
    for (let ev in Events) {
        allEv = allEv.concat(Events[ev].toObject());
    }
    return allEv;
}


// Itération 2 : Récupère tout les events ou le cours(course) est à l'intérieur.
M.getEventsWithCourse = function (course) {
    let allEv = M.getConcatEvents();

    return allEv.filter( ev => ev.type==course );
};


Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
    - 3 + (week1.getDay() + 6) % 7) / 7);
}



// Fonction Initial qui formate le tableau d'objet.
M.FormatResults = function(result) { 
    let res2023 = result.slice(36);
    let res2024 = result.slice(1, 24);
    return [...res2023, ...res2024];
}


// Fonction Itération 1
M.getCountsByWeek = function () {
    let res = new Array(53);
    for(let i=0; i<res.length; i++){
        res[i]=0;
    }

    let allCalendars = M.getConcatEvents();

    for(let cm of allCalendars ){
        let nw = cm.start.getWeek();
        let duration = (cm.end - cm.start) / (3600000);
        res[nw] += duration;
    }

    const resultArray = M.FormatResults(res);

    // console.log(resultArray);

    return resultArray;
};


// Fonction Itération 2 
M.getCountsByWeekWithCourse = function () {
    let res = new Array(53);
    for(let i=0; i<res.length; i++){
        res[i]=0;
    }

    let allCalendars = M.getEventsWithCourse('CM');

    for(let cm of allCalendars ){
        let nw = cm.start.getWeek();

        let duration = (cm.end - cm.start) / 3600000;
        console.log(duration)
        res[nw] += duration;
    }

    const resultArray = M.FormatResults(res);

    console.log(resultArray);

    return resultArray;
};



  
  


export { M };
