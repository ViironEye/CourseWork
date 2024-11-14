export default interface Session {
    uuid: string;
    ip: string;
    ua: string;
    username: string;
    expiresIn: number;
    closed: boolean;
}
