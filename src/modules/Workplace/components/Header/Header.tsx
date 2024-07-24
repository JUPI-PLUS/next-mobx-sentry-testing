// components
import Breadcrumbs from "../../../../components/uiKit/Breadcrumbs/Breadcrumbs";

const Header = ({ uuid }: { uuid?: string }) => {
    return <Breadcrumbs label={Boolean(uuid) ? "Edit workplace" : "Create workplace"} />;
};

export default Header;
