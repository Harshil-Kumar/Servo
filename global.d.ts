export interface Client {
    id?: string;
    name: string;
    date: Date;
    contactPerson: string;
    email: string;
    description: string | null;
    selected: boolean;
}