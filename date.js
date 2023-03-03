exports.getDate = function() {
    const date = new Date();
    const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
    };
    return currentDay = date.toLocaleDateString("vi", options);
}

exports.getDay = function () {
    const date = new Date();
    const options = {
        weekday: "long",
    };
    return currentDay = date.toLocaleDateString("vi", options);
 };

