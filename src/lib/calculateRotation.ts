const calculateRotation = (date = new Date()) => {
    const hours = ((date.getHours() + 11) % 12) + 1;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return {
        seconds: 6 * seconds,
        minutes: 6 * minutes + 0.1 * seconds,
        hours: 30 * hours + 0.5 * minutes,
    };
};

export default calculateRotation