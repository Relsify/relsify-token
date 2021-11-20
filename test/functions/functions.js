module.exports = {
     parseTimeForContract(date) {
        return new Date(date).getTime().toString().slice(0, 10);
    },

    wait (ms = 2000) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, ms);
        });
    }
}