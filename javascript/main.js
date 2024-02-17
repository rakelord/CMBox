/* SUPPORTING FUNCTIONS */
function getDate(date){
    let dateOutput = new Date(date);
    return dateOutput.toLocaleString();
}

function isEmpty(obj) {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }
    return true;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

$(document).ready(function(){

    /* CHARTJS Default Settings */
    Chart.defaults.color = "white";
    Chart.defaults.borderColor = "black";
    Chart.defaults.font.size = 16;
});