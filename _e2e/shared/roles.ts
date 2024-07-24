import { Role } from "testcafe";
import LoginModel from "../pageModels/Login/LoginModel";

export const APPLICATION_URL = "http://localhost:3000";
// export const APPLICATION_URL = "https://dev-front.enverlims.com";
// export const APPLICATION_BE_URL = "https://dev-bpe.enverlims.com/api/v1";
export const APPLICATION_BE_URL = "http://webslims.enverlims.vpn:23001/api/v1";

const ADMIN_CREDS = {
    email: "admin@admin.com",
    password: "Admin1@",
};

export const INVALID_CREDS = {
    email: "invalid@invalid.com",
    password: "Password1@",
};

export const adminUser = Role(`${APPLICATION_URL}/login`, async () => {
    await LoginModel.login(ADMIN_CREDS.email, ADMIN_CREDS.password);
});

export const invalidUser = Role(`${APPLICATION_URL}/login`, async () => {
    await LoginModel.login(INVALID_CREDS.email, INVALID_CREDS.password);
});
