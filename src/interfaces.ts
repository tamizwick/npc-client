export interface SignInData {
    email: string;
    password: string;
}

export interface SignUpData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface CharData {
    _id: string;
    firstName: string;
    user: string;
    lastName?: string;
    pronunciation?: string;
    race?: string[];
    gender?: string;
    alignment?: string;
    appearance?: string;
    knownAssociates?: string[];
    locations?: string[];
    factions?: string[]
    characteristics?: string[];
    biography?: string;
    notableInteractions?: string[];
}