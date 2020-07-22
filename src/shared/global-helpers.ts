export function getRandomString() {
    return (new Date().getTime() + Math.random() * Math.random()).toString();
}