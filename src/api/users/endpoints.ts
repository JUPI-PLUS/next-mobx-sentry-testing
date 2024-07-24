export const USERS_ENDPOINTS = {
    root: "user",
    me() {
        return `${this.root}/me`;
    },
    login() {
        return `${this.root}/login`;
    },
    logout() {
        return `${this.root}/logout`;
    },
    refresh() {
        return `${this.root}/refresh`;
    },
    update: (id: string) => `users/${id}`,
    details(id: string) {
        return `${this.root}/${id}`;
    },
    changePassword: "users/change_password",
    list(filters: string) {
        return `${this.root}/list?${filters}`;
    },
    roles() {
        return `${this.root}/roles`;
    },
    userRoles(uuid: string) {
        return `${this.root}/${uuid}/roles`;
    },
    avatar(userUUID: string, filename: string) {
        //http://webslims.enverlims.vpn:23001/uploads/users/{user_uuid_1-2}/{user_uuid_3-4}/{user_uuid}/profile/{filename}
        //http://webslims.enverlims.vpn:23001/uploads/users/5c/f7/5cf717aa-68ea-429d-9548-4827ba6c8f52/profile/1667916962kIKVJ40HydTWRACF.jpg
        return `users/${userUUID.slice(0, 2)}/${userUUID.slice(2, 4)}/${userUUID}/profile/${filename}`;
    },
};
