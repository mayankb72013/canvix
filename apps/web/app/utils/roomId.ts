export function generateRoomId(length = 8): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomValues = crypto.getRandomValues(new Uint8Array(length));

    let id = "";
    for (let i = 0; i < length; i++) {
        id += chars[randomValues[i]! % chars.length];
    }

    return id;
}
