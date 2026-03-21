import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface FAQ {
    id: bigint;
    question: string;
    order: bigint;
    published: boolean;
    answer: string;
}
export interface AdmissionInfo {
    contact: string;
    fees: string;
    processSteps: string;
    requirements: string;
}
export type Time = bigint;
export interface Content {
    id: bigint;
    title: string;
    content: string;
    date: Time;
    published: boolean;
    author: string;
}
export interface Event {
    id: bigint;
    title: string;
    date: Time;
    published: boolean;
    description: string;
    location: string;
}
export interface Achievement {
    id: bigint;
    title: string;
    year: bigint;
    description: string;
    category: string;
}
export interface GalleryImage {
    id: bigint;
    title: string;
    date: Time;
    imageUrl: string;
    category: string;
}
export interface Staff {
    id: bigint;
    bio: string;
    order: bigint;
    name: string;
    role: string;
    photoUrl?: string;
    department: string;
}
export interface GalleryItem {
    id: bigint;
    title: string;
    blob: ExternalBlob;
    date: Time;
    category: string;
}
export interface SiteInfo {
    about: string;
    principalMessage: string;
    tagline: string;
    email: string;
    address: string;
    principalName: string;
    phone: string;
    schoolName: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGalleryItem(title: string, category: string, blob: ExternalBlob): Promise<GalleryItem>;
    /**
     * / ********* Types *************
     */
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / ********* Achievements *************
     */
    createAchievement(achievementInput: Achievement): Promise<Achievement>;
    /**
     * / ********* Events *************
     */
    createEvent(eventInput: Event): Promise<Event>;
    /**
     * / ********* FAQs *************
     */
    createFAQ(faqInput: FAQ): Promise<FAQ>;
    /**
     * / ********* Gallery *************
     */
    createGalleryImage(imageInput: GalleryImage): Promise<GalleryImage>;
    /**
     * / ********* News *************
     */
    createNews(newsInput: Content): Promise<Content>;
    /**
     * / ********* Staff *************
     */
    createStaff(staffInput: Staff): Promise<Staff>;
    deleteAchievement(id: bigint): Promise<void>;
    deleteEvent(id: bigint): Promise<void>;
    deleteFAQ(id: bigint): Promise<void>;
    deleteGalleryImage(id: bigint): Promise<void>;
    deleteNews(id: bigint): Promise<void>;
    deleteStaff(id: bigint): Promise<void>;
    getAdmissionInfo(): Promise<AdmissionInfo | null>;
    getAllAchievements(): Promise<Array<Achievement>>;
    getAllEvents(): Promise<Array<Event>>;
    getAllFAQs(): Promise<Array<FAQ>>;
    getAllGalleryImages(): Promise<Array<GalleryImage>>;
    getAllGalleryItems(): Promise<Array<GalleryItem>>;
    getAllNewsAdmin(): Promise<Array<Content>>;
    getAllStaff(): Promise<Array<Staff>>;
    /**
     * / ********* User Profile *************
     */
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEvent(id: bigint): Promise<Event>;
    getLogoBlob(): Promise<ExternalBlob | null>;
    getNews(id: bigint): Promise<Content>;
    getPublishedEvents(): Promise<Array<Event>>;
    getPublishedFAQs(): Promise<Array<FAQ>>;
    getPublishedNews(): Promise<Array<Content>>;
    getSiteInfo(): Promise<SiteInfo | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getMenuConfig(): Promise<string | null>;
    isCallerAdmin(): Promise<boolean>;
    setMenuConfig(json: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    /**
     * / ********* Admissions *************
     */
    setAdmissionInfo(info: AdmissionInfo): Promise<void>;
    /**
     * / ********* Logo Management *************
     */
    setLogoBlob(blob: ExternalBlob): Promise<void>;
    /**
     * / ********* Site Info *************
     */
    setSiteInfo(info: SiteInfo): Promise<void>;
    updateAchievement(id: bigint, achievementInput: Achievement): Promise<void>;
    updateEvent(id: bigint, eventInput: Event): Promise<void>;
    updateFAQ(id: bigint, faqInput: FAQ): Promise<void>;
    updateGalleryImage(id: bigint, imageInput: GalleryImage): Promise<void>;
    updateNews(id: bigint, newsInput: Content): Promise<void>;
    updateStaff(id: bigint, staffInput: Staff): Promise<void>;
}
