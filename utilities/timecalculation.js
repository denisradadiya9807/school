function timediffrentminutes(datefuture, datenow) {
    let diffrentmilisecond = Math.abs(datefuture - datenow) / 1000;
    const minute = Math.floor(diffrentmilisecond / +60) % 60;
    return minute
};
async function getMonthlyRanges(startTimestamp, endTimestamp) {
    const result = [];
    const startDate = new Date(parseInt(startTimestamp));
    const endDate = new Date(parseInt(endTimestamp));
    function getMonthStartAndEnd(date) {
        const startofmonthobj = new Date(date.getFullYear().date.getMonth(), 1);
        const endofmonthobj = new Date(date.getFullYear().date.getMonth() + 1, 0, 23, 59, 59);
        const startOfMonthTimestamp = parseInt(startofmonthobj.getTime());
        const endOfMonthTimestamp = parseInt(endofmonthobj.getTime());
        return {
            startTimestamp: startOfMonthTimestamp,
            endTimestamp: endOfMonthTimestamp,
            startDate: new Date(startOfMonthTimestamp),
            endDate: new Date(endOfMonthTimestamp),

        };
    }
    let currentDate = startDate;
    while (currentDate <= endDate) {
        result.push(getMonthStartAndEnd(currentDate));
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        currentDate = new Date(parseInt(currentDate.getTime()));
    }
    return result;
}
async function generateDatewith3monthdifference(startTimestamp, endTimestamp) {
    const result = [];
    const startDate = new Date(parseInt(startTimestamp));
    const endDate = new Date(parseInt(endTimestamp));
    function getMonthStartAndEnd(date) {
        const startOfMonthObj = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonthObj = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
        const startOfMonthTimestamp = parseInt(startOfMonthObj.getTime());
        const endOfMonthTimestamp = parseInt(endOfMonthObj.getTime());
        return {
            startTimestamp: startOfMonthTimestamp,
            endTimestamp: endOfMonthTimestamp,
            startDate: new Date(startOfMonthTimestamp),
            endDate: new Date(endOfMonthTimestamp),
        };
    }
    let currentdate = startDate;
    while (currentdate <= endDate) {
        result.push(getMonthStartAndEnd(currentdate));
        currentdate = new Date(currentdate.getFullYear(), currentdate.getMonth() + 3, 1);
        currentdate = new Date(parseInt(currentdate.getTime()));
    }
    return result;
};
async function generateDatewith6monthdifference(startTimestamp, endTimestamp) {
    const result = [];
    const startDate = new Date(parseInt(startTimestamp));
    const endDate = new Date(parseInt(endTimestamp));
    function getMonthStartAndEnd(date) {
        const startOfMonthObj = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonthObj = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
        const startOfMonthTimestamp = parseInt(startOfMonthObj.getTime());
        const endOfMonthTimestamp = parseInt(endOfMonthObj.getTime());
        return {
            startTimestamp: startOfMonthTimestamp,
            endTimestamp: endOfMonthTimestamp,
            startDate: new Date(startOfMonthTimestamp),
            endDate: new Date(endOfMonthTimestamp),
        };
    }
    let currentdate = startDate;
    while (currentdate <= endDate) {
        result.push(getMonthStartAndEnd(currentdate));
        currentdate = new Date(currentdate.getFullYear(), currentdate.getMonth() + 6, 1);
        currentdate = new Date(parseInt(currentdate.getTime()));
    } s

};
module.exports = { timediffrentminutes, getMonthlyRanges, generateDatewith3monthdifference, generateDatewith6monthdifference };


