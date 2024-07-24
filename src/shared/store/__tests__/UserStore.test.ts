import { UserStore } from "../UserStore";
import { MOCK_USER } from "../../../testingInfrustructure/mocks/users";
import { USERS_ENDPOINTS } from "../../../api/users/endpoints";
import { UserStatus } from "../../models/business/user";

describe("UserStore", () => {
    it("Should set and cleanup", () => {
        const store = new UserStore();

        store.setUser(MOCK_USER({}));

        expect(store.user).toBeTruthy();

        store.cleanup();

        expect(store.user).toBeNull();
    });

    it.each([
        MOCK_USER({ hasImage: true }),
        MOCK_USER({ hasImage: false }),
        MOCK_USER({ status: UserStatus.BLOCKED }),
        MOCK_USER({ status: UserStatus.NEW }),
        MOCK_USER({ status: UserStatus.ACTIVE }),
    ])("Should return correct computed values", user => {
        const store = new UserStore();

        store.setUser(user);

        expect(store.status).toBe(user.status);
        expect(store.email).toBe(user.email);
        expect(store.name).toBe(`${user.first_name} ${user.last_name}`);
    });

    it.skip("Should return profile photo url if user has avatar", () => {
        const store = new UserStore();
        const mockedUser = MOCK_USER({ hasImage: true });

        store.setUser(mockedUser);

        expect(store.avatar).toEqual(USERS_ENDPOINTS.avatar(mockedUser.uuid, mockedUser.profile_photo!));
    });

    it("Should not return profile photo url if user hasn't avatar", () => {
        const store = new UserStore();
        const mockedUser = MOCK_USER({ hasImage: false });

        store.setUser(mockedUser);

        expect(store.avatar).toEqual("");
    });

    it("Should return default values if user details wasnt provided", () => {
        const store = new UserStore();

        expect(store.status).toBe(0);
        expect(store.email).toBe("");
        expect(store.name).toBe(" ");
        expect(store.avatar).toBe("");
    });
});
