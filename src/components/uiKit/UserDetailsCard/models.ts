export interface UserDetailsCardProps {
    variant?: "info" | "active";
    firstName: string | null;
    lastName: string | null;
    birthday: number | null;
    uuid: string;
    avatar: string;
    containerClassName?: string;
    onClick?: () => void;
    isDeleted: boolean;
    barcode: string;
}
