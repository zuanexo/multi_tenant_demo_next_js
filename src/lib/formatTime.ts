function formatTimeAMPM(date = new Date()) {
    const hours = date.getHours() % 12 || 12; // Get hours in 12-hour format
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    // Ensure the time parts have leading zeros if needed
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
}

export default formatTimeAMPM