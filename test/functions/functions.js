module.exports = {
     parseTimeForContract(date) {
        return new Date(date).getTime().toString().slice(0, 10);
    }
}