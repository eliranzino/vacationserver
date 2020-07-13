export interface Vacation {
    ID: number;
    description: string;
    destination: string;
    picture: string;
    departure: Date;
    returnAt: Date;
    price: number;
    followersAmount: number;
}