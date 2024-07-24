import AddRoleDialog from "../dialogs/AddRoleDialog/AddRoleDialog";

const Header = () => {
    return (
        <div className="flex justify-between">
            <h2 className="text-2xl font-bold">Roles</h2>
            <AddRoleDialog />
        </div>
    );
};

export default Header;
